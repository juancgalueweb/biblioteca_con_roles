const jwt = require("jsonwebtoken");

module.exports.validateJWT = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No hay token en la petición",
    });
  }
  try {
    const { userId, firstName, email, role } = jwt.verify(
      token,
      process.env.SECRET_KEY
    );
    req.userId = userId;
    req.firstName = firstName;
    req.email = email;
    req.role = role;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        msg: "Token expirado. Vuelva a iniciar sesión.",
      });
    }
    // console.log(err);
    return res.status(401).json({
      success: false,
      msg: "Token no válido",
    });
  }
  next();
};
