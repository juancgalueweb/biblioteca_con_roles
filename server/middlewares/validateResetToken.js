const { isValidObjectId } = require("mongoose");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.isResetTokenValid = async (req, res, next) => {
  // el query es el contenido de la ruta URL para resetar la contraseña
  const { token, id } = req.query;
  if (!token || !id) {
    return res.status(401).json({
      msg: "Solicitud inválida",
      success: false,
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(401).json({
      msg: "Usuario inválido",
      success: false,
    });
  }

  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(401).json({
      msg: "Usuario no encontrado",
      success: false,
    });
  }

  try {
    const jwtResponse = jwt.verify(token, process.env.SECRET_KEY);
    req.user = jwtResponse.userId;
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Token inválido o expirado",
    });
  }

  next();
};
