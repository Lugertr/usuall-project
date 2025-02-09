module.exports = {
  "/api/**": {
    target: "http://api.dionis.cloud:8000/",
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    onreq: (req) => {
      const token = "f3e8822a-359b-45ad-bc21-6fa1129ef1d4";
      req.headers["Authorization"] = `Bearer ${token}`;
    },
  },
  "/login": {
    target: "http://api.dionis.cloud:8080/",
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    onreq: (req) => {
      const token = "f3e8822a-359b-45ad-bc21-6fa1129ef1d4";
      req.headers["Authorization"] = `Bearer ${token}`;
    },
  },
  "/autologin": {
    target: "http://api.dionis.cloud:8080/",
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    onreq: (req) => {
      const token = "f3e8822a-359b-45ad-bc21-6fa1129ef1d4";
      req.headers["Authorization"] = `Bearer ${token}`;
    },
  },
};
