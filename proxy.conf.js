module.exports = {
  "/api/**": {
    target: "http://api.dionis.cloud:8000/",
    secure: false,
    changeOrigin: true,
  },
  "/login": {
    target: "http://api.dionis.cloud:8000/",
    secure: false,
    changeOrigin: true,
  },
  "/autologin": {
    target: "http://api.dionis.cloud:8000/",
    secure: false,
    changeOrigin: true,
  },
};
