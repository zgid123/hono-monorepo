# Deploying the server

This boilerplate includes EC2, ECS/Fargate, and Cloudflare Containers deployment actions so consumers can choose a provider after cloning. The example workflow selects EC2; retain the other actions as supported alternatives.

`server-test.yml` runs on pushes to `main` and pull requests that change the server workspace, shared packages it uses, root `package.json`, or EC2 image and deployment files. Root lockfile and tooling changes, unrelated workspaces, and ECS or Cloudflare actions do not trigger it. The test job installs dependencies and runs `pnpm test`; production compilation happens when the deployment workflow builds the Docker image. After a successful test run for a push to `main`, `server-deploy.yml` deploys that tested commit when `SERVER_DEPLOY_ENABLED=true`. It builds `infrastructures/server/Dockerfile` once and transfers the Docker archive to the release job. EC2 copies the archive over SSH and runs that image. ECS and Cloudflare publish the built image and deploy its registry digest. The test and deployment workflows remain separate.

The EC2 deployment action uses its `container-name` and `environment-file` inputs from the GitHub production environment. It starts the inactive container slot, checks `/health` on its localhost port, changes the Nginx upstream, validates the Nginx configuration, and reloads Nginx. As soon as the reload command succeeds, it starts stopping the old container. Requests still using the old container may be interrupted. The health endpoint confirms the process is responding; it does not check PostgreSQL connectivity. See [Nginx setup](nginx.md).

The server requires PostgreSQL 18 reachable from the running application. Run required migrations from an environment that can reach the database before deploying a version that depends on them. The deploy actions do not run migrations. Keep migrations compatible with old and new application versions during rollout. Set `BETTER_AUTH_URL` to the public HTTPS origin and `ALLOWED_ORIGINS` to permitted browser origins where applicable.

## Common GitHub configuration

Set the repository variable `SERVER_DEPLOY_ENABLED=true` after platform setup. Create a GitHub environment named `production` and put the selected provider's secrets and variables there. Because deployment is triggered by `workflow_run`, GitHub evaluates environment branch rules against the default branch (`main`); configure the environment to allow deployments from `main`. All jobs use GitHub's Ubuntu runner. It builds the image once with a tag containing the seven-character tested SHA, CI run ID, and attempt, then saves and uploads that image as `docker-image-hono-server`. Rebuilding a workflow run replaces that run’s artifact; retrying only the release job reuses it. Artifacts are retained for one day. It injects the seven-character SHA as `APP_VERSION`, which `/health` returns. The release job checks out the tested SHA and downloads the exact Docker image artifact. EC2 loads it on the remote host; ECS and Cloudflare require Docker on the release runner to load and publish it. Deployments to production are serialized. Switching providers means replacing the release action block and its associated environment variables and secrets.

## EC2 (default)

1. Use an x86-64 Ubuntu instance reachable over SSH from the release runner and able to reach PostgreSQL. Install Docker, curl, Nginx, and `procps`; enable Docker and Nginx on boot. Give the SSH user permission to run Docker and passwordless sudo for `nginx -t` and `systemctl reload nginx`. Allow SSH only from trusted deployment sources.
2. Add the deployment public key to the SSH user's `authorized_keys`. In the GitHub `production` environment, set `EC2_HOST`, `EC2_USER`, and secret `EC2_SSH_KEY`.
3. Create the server environment file on EC2. Set `EC2_ENVIRONMENT_FILE` and `EC2_CONTAINER_NAME` in the GitHub `production` environment. The deployment uses ports 3000 and 3001 by default. Set `EC2_BLUE_PORT` and `EC2_GREEN_PORT` if your existing Nginx upstream uses a different host port:

   | Setting | Example |
   |---|---|
   | `EC2_CONTAINER_NAME` | `hono-server` |
   | `EC2_ENVIRONMENT_FILE` | `/opt/hono/production.env` |
   | `EC2_BLUE_PORT` (optional) | `3000` |
   | `EC2_GREEN_PORT` (optional) | `3001` |

   The file holds `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ADMIN_EMAIL`, `BETTER_AUTH_SECRET`, `PORT=3000`, `NODE_ENV=production`, and optional `ADMIN_PASSWORD`, `BETTER_AUTH_URL`, `ALLOWED_ORIGINS`, and `PGSSLMODE`. Set `PGSSLMODE=verify-full` when the PostgreSQL provider requires verified TLS and its CA is trusted by the runtime.
4. Configure [Nginx](nginx.md). Create a deployment-user-owned service directory as described in the Nginx guide, then install the upstream snippet at `/etc/nginx/hono-deploy/<EC2_CONTAINER_NAME>/upstream.conf` with `proxy_pass http://127.0.0.1:<EC2_BLUE_PORT>;` before the first release. For an existing installation, point it to the current container's published localhost port and set `EC2_BLUE_PORT` to that port. Choose an unused `EC2_GREEN_PORT`; the action alternates between both localhost ports, keeps the active slot serving requests while the new one starts, and changes the snippet when the candidate passes `/health`.
5. The action checks the candidate at `/health`, updates the upstream snippet, runs `nginx -t`, and reloads Nginx. After the reload command succeeds, it immediately starts stopping the previous container with Docker's 30-second stop timeout. Requests still using that container can be interrupted. If the health check or configuration validation fails, the previous slot keeps serving and the candidate is removed. If the reload command fails, the action restores the previous snippet and retries the reload; it removes the candidate only when rollback succeeds, otherwise it leaves both containers running for recovery. After release, check `docker ps`, container logs, and `https://<hostname>/health`.

## ECS with Fargate

Create an ECR repository and a Fargate cluster/service with `awsvpc` networking, an application container on port 3000, and an ALB target group checking `/health`. The task execution role needs ECR pull and CloudWatch Logs permissions. Supply the server variables and secrets through the task definition, including optional `PGSSLMODE=verify-full` when the PostgreSQL endpoint requires verified TLS and its CA is trusted by the runtime. Allow service tasks to reach PostgreSQL. Create a GitHub OIDC role trusting the subject `repo:OWNER/REPO:environment:production`, with audience `sts.amazonaws.com`. Because the deploy workflow uses `workflow_run`, restrict the GitHub production environment branch policy to the default branch `main`. Give the role ECR publish plus ECS service and task definition describe/update/register permissions and required `iam:PassRole` permissions.

Set the ECR repository's tag mutability to `IMMUTABLE`. When switching the release job to ECS, also grant it `id-token: write` permission for the GitHub OIDC role. Set `AWS_REGION`, `AWS_ROLE_ARN`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`, and the task-definition `container` variable in the GitHub production environment.

Replace the EC2 release step with:

```yaml
- name: Load built image
  run: gzip -dc "$RUNNER_TEMP/server-image/hono-server.tar.gz" | docker load

- name: Release to ECS
  uses: ./.github/actions/deploy-ecs
  with:
    image: ${{ needs.build.outputs.image }}
    aws-region: ${{ vars.AWS_REGION }}
    role-arn: ${{ vars.AWS_ROLE_ARN }}
    repository: ${{ vars.ECR_REPOSITORY }}
    cluster: ${{ vars.ECS_CLUSTER }}
    service: ${{ vars.ECS_SERVICE }}
    container: server
```

Check ECS service events, CloudWatch logs, and the ALB health endpoint after release. Use the previous task definition for application rollback; any separately applied migrations remain applied.

## Cloudflare Containers

Use an account with Containers enabled and a token permitted to deploy Workers and push container images. The API needs an external PostgreSQL endpoint reachable from Cloudflare Containers. Provide TLS for database connections according to the database provider. Store `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ADMIN_EMAIL`, and `BETTER_AUTH_SECRET` as Worker secrets. Set optional `PGSSLMODE=verify-full` when the endpoint requires verified TLS and its CA is trusted by the runtime. `ADMIN_PASSWORD`, `BETTER_AUTH_URL`, and `ALLOWED_ORIGINS` are also optional Worker secrets. On first setup, create the Worker and its secrets before enabling automatic deployment. Configure the desired custom domain or use its workers.dev URL. The default container policy handles image rollouts.

Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_WORKER_NAME`, and secret `CLOUDFLARE_API_TOKEN` in the GitHub production environment. Create Worker secrets on the exact Worker name; GitHub environment secrets are not automatically Worker secrets. The release runner needs Docker and pnpm. The Worker package is at `infrastructures/server/cloudflare`. Replace the EC2 release step with:

```yaml
- name: Load built image
  run: gzip -dc "$RUNNER_TEMP/server-image/hono-server.tar.gz" | docker load

- name: Release to Cloudflare
  uses: ./.github/actions/deploy-cloudflare
  with:
    image: ${{ needs.build.outputs.image }}
    account-id: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
    api-token: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    config-path: infrastructures/server/cloudflare/wrangler.json
    worker-name: ${{ vars.CLOUDFLARE_WORKER_NAME }}
    container-class: ServerContainer
```

Pass `container-class` with the selected entry's `class_name` (currently `ServerContainer`). The action locates Wrangler beside `config-path`, requires exactly one matching `class_name`, pushes the image, then writes the requested Worker name and image digest to a temporary config beside the original. Wrangler validates and deploys that config after the push, so a config error can fail deployment after the image has been uploaded. The temporary config is removed after deployment. The committed image is a release placeholder, so the config is not ready for a direct `wrangler deploy` until a real image is supplied. This setup uses explicit Worker names rather than Wrangler named environments. It uses `CLOUDFLARE_ACCOUNT_ID` for push and deploy, pushes the built image to Cloudflare Registry, and deploys its digest. Wrangler deploys the Worker configuration as a whole. Check the public `/health` endpoint after release; it confirms the process responds and does not check database connectivity. Run required database migrations separately from an environment that can reach PostgreSQL before deploying a version that depends on them. Inspect Workers/Containers logs and deployment status on failure. To roll back application code, deploy a prior known-good image reference with the matching Worker revision; any separately applied database migrations remain applied.

## Adding Cloudflare services

Use one Worker/config per service when services need independent deployment. When a second service is added, organize the existing config and entrypoint alongside it:

```text
infrastructures/
  server/
    Dockerfile
    cloudflare/
      package.json
      wrangler.json
      src/index.ts
  billing/
    Dockerfile
    cloudflare/
      package.json
      wrangler.json
      src/index.ts
```

Each server's Cloudflare directory is its own pnpm package with Wrangler, Workers types, and Containers dependencies. Give each package a unique package name. The existing `infrastructures/**` workspace glob discovers these packages. Each config's `$schema` points to `./node_modules/wrangler/config-schema.json`, and `main` remains relative to its own directory. Each entrypoint forwards only the variables its service needs. Reusing the same class name in different Workers is fine; Worker names must be unique per service and environment.

For each service, build its Dockerfile, load its image in the release job, and call the existing Cloudflare action with that service's config, class, and Worker name. Use a concurrency group per service and environment. Start with explicit jobs; extract a reusable workflow or a matrix when there are actual repeated deployment jobs. Shared package, lockfile, and tooling changes must trigger checks for affected services as well as changes in the service itself.

A single config can contain multiple container classes and bindings, but its entrypoint must explicitly route requests by hostname or path. Deploy all images together or preserve every other service's exact deployed image reference, and serialize deployments to that Worker. Updating one container image still deploys the whole Worker/config; separate release jobs using older config snapshots can overwrite one another. Prefer this arrangement only when the services share a release lifecycle.

The current `getByName('server')` selects one container instance. It is sufficient for a small service that accepts cold starts after ten idle minutes and interruptions during instance replacement. Raising `max_instances` alone does not spread traffic. When replicas are needed, add explicit routing across instance IDs (for example, the Containers SDK's `getRandom` helper for stateless workloads) and set the limit accordingly. Keep PostgreSQL external, and run migrations separately before release.

References: [Cloudflare configuration](https://developers.cloudflare.com/containers/configuration/wrangler/), [scaling and routing](https://developers.cloudflare.com/containers/configuration/scaling-and-routing/).
