module.exports.authBasic = (req, res, next) => {
  if (req.role === "basic") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      msg: "Usuario no tiene el rol de usuario básico",
    });
  }
};
