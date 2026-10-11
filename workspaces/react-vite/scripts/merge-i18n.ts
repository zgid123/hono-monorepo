import { mergeMessages } from '@config/i18n';

await mergeMessages({
  sharedMessagesDir: '../../packages/@config/i18n/src/locales',
  localMessagesDir: 'src/integrations/i18n',
  outputDir: 'src/integrations/i18n/.merged',
});
