//En este token, vamos a guardar el otp (one-time-password) con el hash de bcrypt

const jwt = require("jsonwebtoken");

module.exports.jwtVerifyEmail = (otpHash) => {
  return new Promise((resolve, reject) => {
    const payload = { otpHash };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: 600 }, //esos son 600 segundos, 10 minutos
      (error, token) => {
        if (error) {
          reject({ success: false, msg: error });
        }
        resolve(token);
      }
    );
  });
};
