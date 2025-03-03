module.exports = {
  '/api/**': {
    target: 'http://app.dionis.cloud/',
    changeOrigin: true,
    secure: false,
  },
  '/login': {
    target: 'http://app.dionis.cloud/',
    changeOrigin: true,
    secure: false,
  },
  '/autologin': {
    target: 'http://app.dionis.cloud/',
    changeOrigin: true,
    secure: false,
  },
};
