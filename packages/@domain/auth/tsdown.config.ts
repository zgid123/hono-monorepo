import { defineConfig } from 'tsdown/config';

export default defineConfig({
  dts: true,
  clean: true,
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  fixedExtension: false,
  entry: ['src/index.ts', 'src/constants/index.ts'],
  deps: {
    neverBundle: ['arktype'],
    dts: {
      neverBundle: true,
    },
  },
});
