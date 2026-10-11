import { execFile } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, type Plugin } from 'vite';

import { paraglideConfig } from './i18n.config.ts';

const workspaceDirectory = dirname(fileURLToPath(import.meta.url));
const sharedMessagesDirectory = resolve(
  workspaceDirectory,
  '../../packages/@config/i18n/src/locales',
);
const localMessagesDirectory = resolve(
  workspaceDirectory,
  'src/integrations/i18n',
);
const execFileAsync = promisify(execFile);

await execFileAsync('pnpm', ['exec', 'tsx', 'scripts/merge-i18n.ts'], {
  cwd: workspaceDirectory,
});

function watchI18nMessages(): Plugin {
  const messageFiles = new Set(
    ['en.json', 'vi.json'].flatMap((locale) => [
      resolve(sharedMessagesDirectory, locale),
      resolve(localMessagesDirectory, locale),
    ]),
  );

  return {
    name: 'tanstack-start-i18n-message-merge',
    configureServer(server) {
      server.watcher.add([...messageFiles]);

      let restartTimer: ReturnType<typeof setTimeout> | undefined;

      function restartForMessageChange(filePath: string): void {
        if (!messageFiles.has(resolve(filePath))) {
          return;
        }

        clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
          void server.restart();
        }, 100);
      }

      server.watcher.on('change', restartForMessageChange);

      return () => {
        clearTimeout(restartTimer);
        server.watcher.off('change', restartForMessageChange);
      };
    },
  };
}

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    watchI18nMessages(),
    devtools(),
    paraglideVitePlugin(paraglideConfig),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
