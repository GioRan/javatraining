module.exports = {
    devServer: {
      proxy: {
        '/dogs': {
          target: 'http://localhost:8080',
          ws: true,
          changeOrigin: true
        }
      }
    }
  }