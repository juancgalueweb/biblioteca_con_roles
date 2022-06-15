const jwt = require("jsonwebtoken");

module.exports.genJWT = (userId, firstName, email, role) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, firstName, email, role };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "10000" },
      (err, token) => {
        if (err) {
          reject("No se puede generer el token");
        }
        resolve(token);
      }
    );
  });
};
