const { isValidObjectId } = require("mongoose");
const { comparePassOrToken } = require("../helpers/hashPassOrToken");
const ResetTokenModel = require("../models/resetToken.model");
const UserModel = require("../models/user.model");

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

  const resetToken = await ResetTokenModel.findOne({ owner: user._id });
  if (!resetToken) {
    return res.status(401).json({
      msg: "Token de respuesta no encontrado",
      success: false,
    });
  }

  const isValid = comparePassOrToken(token, resetToken.token);
  if (!isValid) {
    return res.status(401).json({
      msg: "Token para resetear contraseña no es válido",
      success: false,
    });
  }

  req.user = user;
  next();
};
