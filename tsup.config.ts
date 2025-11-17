import {defineConfig} from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: {
    'index': './src/index.tsx',
    'store/messagesStore': './src/store/messagesStore.ts',
    'store/agentsStore': './src/store/agentsStore.ts',
    'store/threadsStore': './src/store/threadsStore.ts',
    'socket/socket': './src/socket/socket.ts',
    'api/api': './src/api/api.ts',
    'config/config': './src/config/config.ts',
    'utils/utils': './src/utils/utils.ts',
  },
  dts: false,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  loader: {
    '.js': 'jsx',
    '.png': 'dataurl', // Convert PNG images to data URLs
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.svg': 'text', // Keep SVG as text for react-native-svg
  },
});
