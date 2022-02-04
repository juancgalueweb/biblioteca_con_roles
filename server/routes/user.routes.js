const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  lateVerifyEmail,
} = require("../controllers/user.controllers");
const { isResetTokenValid } = require("../middlewares/validateResetToken");

module.exports = (app) => {
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/verify-email", verifyEmail);
  app.post("/api/auth/late-verify-email", lateVerifyEmail);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.post("/api/auth/reset-password", isResetTokenValid, resetPassword);
  app.get("/api/auth/verify-token", isResetTokenValid, (_, res) => {
    res.json({ success: true, msg: "El token es válido" });
  });
};
