const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // ... other webpack configurations
  resolve: {
    fallback: {
      fs: false, // Don't include 'fs' module
      path: require.resolve('path-browserify'), // Use 'path-browserify' instead
    },
  },
  // ... other webpack configurations
  plugins: [
    // Add the NodePolyfillPlugin to your plugins list
    new NodePolyfillPlugin(),
    // ... other plugins
  ],
};
