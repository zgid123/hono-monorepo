import { defineConfig } from 'tsdown/config';

export default defineConfig({
  dts: true,
  clean: true,
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  fixedExtension: false,
  entry: [
    'src/handlers/index.ts',
    'src/interfaces/index.ts',
    'src/middlewares/index.ts',
  ],
  deps: {
    dts: {
      neverBundle: true,
    },
  },
});
