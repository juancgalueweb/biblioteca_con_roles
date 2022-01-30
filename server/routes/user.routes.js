const {
  registerUser,
  loginUser,
  verifyEmail,
} = require("../controllers/user.controllers");

module.exports = (app) => {
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/verify-email", verifyEmail);
};
