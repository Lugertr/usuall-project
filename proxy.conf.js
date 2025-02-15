module.exports = {
  "/api/**": {
    target: "http://api.dionis.cloud/",
    changeOrigin: true,
    secure: false,
  },
  "/login": {
    target: "http://api.dionis.cloud/",
    changeOrigin: true,
    secure: false,
  },
  "/autologin": {
    target: "http://api.dionis.cloud/",
    changeOrigin: true,
    secure: false,
  },
};
