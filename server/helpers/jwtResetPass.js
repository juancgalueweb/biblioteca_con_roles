//Generar jwt a ser usado para enviar un token dentro de una url a usar para resetear la contraseña

const jwt = require("jsonwebtoken");

module.exports.jwtResetPass = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: 600 },
      (err, token) => {
        if (err) {
          reject({ success: false, msg: err });
        }
        resolve(token);
      }
    );
  });
};
