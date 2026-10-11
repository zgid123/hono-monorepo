import type { ParaglideVitePluginOptions } from '@inlang/paraglide-js';

export const paraglideConfig: ParaglideVitePluginOptions = {
  project: './project.inlang',
  outdir: './src/integrations/i18n/paraglide',
  strategy: ['url', 'baseLocale'],
  urlPatterns: [
    {
      pattern: '/:path(.*)?',
      localized: [
        ['vi', '/vi/:path(.*)?'],
        ['en', '/:path(.*)?'],
      ],
    },
  ],
};
