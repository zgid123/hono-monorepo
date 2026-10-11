import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mergeDeep } from '@alphacifer/core-utils/remeda';

import { locales } from './base';

export interface IMergeMessagesOptions {
  sharedMessagesDir: string;
  localMessagesDir: string;
  outputDir: string;
}

export async function mergeMessages({
  outputDir,
  localMessagesDir,
  sharedMessagesDir,
}: IMergeMessagesOptions): Promise<void> {
  await mkdir(outputDir, {
    recursive: true,
  });

  for (const locale of locales) {
    const outputPath = join(outputDir, `${locale}.json`);
    const localPath = join(localMessagesDir, `${locale}.json`);
    const sharedPath = join(sharedMessagesDir, `${locale}.json`);

    const shared = JSON.parse(await readFile(sharedPath, 'utf8')) as Record<
      string,
      unknown
    >;
    const local = JSON.parse(await readFile(localPath, 'utf8')) as Record<
      string,
      unknown
    >;

    const merged = mergeDeep(shared, local);

    await writeFile(outputPath, `${JSON.stringify(merged, null, 2)}\n`);
  }
}
