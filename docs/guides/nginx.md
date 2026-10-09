# Nginx for EC2 production

Nginx terminates public HTTPS and proxies requests to one of two server containers on the same EC2 host. The [`server.conf`](../../infrastructures/server/server.conf) template includes `/etc/nginx/hono-deploy/hono-server/upstream.conf`; the deploy action changes that snippet between localhost ports `EC2_BLUE_PORT` (default 3000) and `EC2_GREEN_PORT` (default 3001). It starts with HTTP; Certbot adds HTTPS and HTTP-to-HTTPS redirects to the installed configuration. Keep both ports private; allow inbound 80 and 443 in the EC2 security group.

1. Point the production hostname's DNS A record to the EC2 public address.
2. Install Nginx and Certbot on Ubuntu 24.04: `sudo apt update && sudo apt install nginx certbot python3-certbot-nginx`.
3. Create the service directory with `sudo install -d -m 755 -o "$USER" -g "$(id -gn)" /etc/nginx/hono-deploy/hono-server` while logged in as the deployment user. As that user, write `/etc/nginx/hono-deploy/hono-server/upstream.conf` containing `proxy_pass http://127.0.0.1:3000;`, or the current container's published localhost port when migrating. Ownership of the directory is required because the action creates temporary files and atomically replaces the snippet; ownership of the file alone is insufficient. Keep `/etc/nginx/hono-deploy` root-owned; grant this deployment user write access only to its own service directory. If `EC2_CONTAINER_NAME` differs from `hono-server`, use `/etc/nginx/hono-deploy/<EC2_CONTAINER_NAME>/upstream.conf` and update the include path in the server configuration.
4. Replace the example hostname in `infrastructures/server/server.conf`, copy it to `/etc/nginx/sites-available/server.conf`, symlink `/etc/nginx/sites-enabled/server.conf` to it, and run `sudo nginx -t && sudo systemctl reload nginx`.
5. Once DNS and HTTP work, obtain and install a certificate with `sudo certbot --nginx --redirect -d api.example.com`. Certbot updates the installed configuration with the certificate paths, HTTPS listener, and HTTP redirect.
6. Run `sudo nginx -t` and confirm the route with `curl -fsS https://api.example.com/health`. Check renewal with `sudo certbot renew --dry-run`.

The GitHub deployment user needs passwordless sudo to run `nginx -t` and `systemctl reload nginx`. After the reload command succeeds, the deploy action immediately starts stopping the old container with Docker's 30-second stop timeout. Nginx may still have requests using the old container, so those requests can be interrupted during the switch.

Use the repository template for initial setup. After Certbot configures HTTPS, edit the installed configuration for routing changes so its generated TLS settings are preserved. See the [Certbot Nginx documentation](https://eff-certbot.readthedocs.io/en/stable/using.html#nginx).

The template forwards `X-Forwarded-For` as the direct client address. Nginx logs are in `/var/log/nginx`; container logs are available with `docker logs <container-name>`. Keep the certificate key readable only by privileged processes.

## Migrating an existing installation

Before enabling the updated workflow, create the service directory above and copy the existing snippet into `upstream.conf`, preserving the currently active port. Give the deployment user ownership of the copied file as well. Update the include path in the installed Nginx configuration without replacing Certbot's TLS settings, then run `sudo nginx -t && sudo systemctl reload nginx`. Confirm public `/health` still responds before deploying. The old snippet can be removed after the new include is verified.
