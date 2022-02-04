const UserModel = require("../models/user.model");
const { jwtResetPass } = require("../helpers/jwtResetPass");
const { jwtVerifyEmail } = require("../helpers/jwtVerifyEmail");
const { genJWT } = require("../helpers/jwt");
const {
  generateOTP,
  mailTransport,
  generatePasswordResetTemplate,
  generateSendOTPTemplate,
  generalEmailTemplate,
} = require("../helpers/mailVerify");
const { isValidObjectId } = require("mongoose");
const {
  generateHashPassOrToken,
  comparePassOrToken,
} = require("../helpers/hashPassOrToken");
const jwt = require("jsonwebtoken");

//Método para registrar un usuario
module.exports.registerUser = async (req, res) => {
  try {
    const newUser = UserModel(req.body);
    const user = await UserModel.findOne({ email: newUser.email });
    if (user) {
      return res
        .status(401)
        .json({ msg: "Correo ya existe en la base de datos", success: false });
    }
    // Validar longitud del password, min: 8, max: 20
    if (
      newUser.password.trim().length < 8 ||
      newUser.password.trim().length > 20
    ) {
      return res.status(401).json({
        success: false,
        msg: "Contraseña debe ser mínimo de 8 y máximo de 20 caracteres, inclusive",
      });
    }
    //Encrypt password
    newUser.password = await generateHashPassOrToken(newUser.password);

    //Generamos un OTP y se lo enviamos al usuario recién registrado, por e-mail, para que lo use cuando valide su e-mail
    const OTP = generateOTP();
    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: newUser.email,
      subject: "Por favor, verifica tu correo electrónico",
      html: generateSendOTPTemplate(OTP),
    });

    //Hacemos un Hash del OTP y lo guardamos en JWT por 10 min
    const hastOTP = await generateHashPassOrToken(OTP);
    const jwtToken = await jwtVerifyEmail(hastOTP);

    // Guardamos el usuario en la BD con el password con hash
    await newUser.save();

    return res.json({ user: newUser, token: jwtToken });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
};

//Método para hacer el login de un usuario
module.exports.loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    // Valida si el usuario existe
    if (!user) {
      return res.status(401).json({ success: false, msg: "Usuario no existe" });
    }
    //Rechaza el login de un usuario válido pero con correo no verificado
    if (!user.verified) {
      return res
        .status(401)
        .json({ success: false, msg: "Su e-mail no ha sido verificado" });
    }
    const { _id, firstName, email, password, role } = user;
    //Revisa si el password es válido, y de serlo, se le asigna un token que dura 24 horas, con el que podrá consultar las APIs
    const validPassword = comparePassOrToken(req.body.password, password);
    if (validPassword) {
      const token = await genJWT(_id, firstName, email, role);
      return res.json({
        _id: _id,
        firstName: firstName,
        token: token,
        role: role,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "Contraseña incorrecta" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
};

//Método para verificar el correo electrónico
module.exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp, token } = req.body;

    //Buscamos el token con el hash que lo tiene JWT
    const { otpHash } = jwt.verify(token, process.env.SECRET_KEY);

    if (!userId || !otp.trim()) {
      return res
        .status(401)
        .json({ msg: "Solicitud inválida", success: false });
    }

    if (!isValidObjectId(userId)) {
      return res.status(401).json({ msg: "userId inválido", success: false });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    if (user.verified) {
      return res
        .status(401)
        .json({ msg: "Esta cuenta ya se verificó", success: false });
    }

    const isMatched = comparePassOrToken(otp, otpHash);
    if (!isMatched) {
      return res.status(401).json({ msg: "Token inválido", success: false });
    }

    user.verified = true;
    await user.save();

    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: user.email,
      subject: "Verificación exitosa",
      html: generalEmailTemplate(
        `Muchas gracias, ${user.firstName}`,
        "La verificación del e-mail fue un éxito."
      ),
    });

    return res.json({
      success: true,
      msg: "Su correo fue verificado",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Token ha expirado",
      jwtError: err.message,
    });
  }
};

//Controlador para olvido de contraseña
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ msg: "E-mail inválido", success: false });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ msg: "Su e-mail no ha sido validado", success: false });
    }

    const jwtToken = await jwtResetPass(user._id);

    mailTransport().sendMail({
      from: "security@email.com",
      to: user.email,
      subject: "Reseteo de contraseña",
      html: generatePasswordResetTemplate(
        `http://localhost:3000/reset-password?token=${jwtToken}&id=${user._id}`
      ),
    });

    return res.json({
      success: true,
      msg: "Se envió a su e-mail el link para resetear la contraseña",
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
};

//Contolador para resetear la contraseña
module.exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    //En el middleware le asigno a req.user la respuesta al verificar el token con jwt, que es el id del usuario que pidió cambio de contraseña
    const user = await UserModel.findById(req.user);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    const isSamePassword = comparePassOrToken(password, user.password);
    if (isSamePassword) {
      return res.status(401).json({
        msg: "La nueva contraseña no puede ser igual a la anterior",
        success: false,
      });
    }

    if (password.trim().length < 8 || password.trim().length > 20) {
      return res.status(401).json({
        msg: "La longitud del password debe ser entre 8 y 20 caracteres",
        success: false,
      });
    }

    //Encrypt new password
    user.password = generateHashPassOrToken(password);
    await user.save();

    mailTransport().sendMail({
      from: "security@email.com",
      to: user.email,
      subject: "Reseteo de contraseña exitoso",
      html: generalEmailTemplate(
        `Todo está listo ${user.firstName}`,
        "El reseteo de la contraseña fue exitoso, ahora puede iniciar sesión con la nueva contraseña."
      ),
    });

    return res.json({ success: true, msg: "Reseteo de contraseña exitoso" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
};

module.exports.lateVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({ msg: "E-mail inválido", success: false });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    if (user.verified) {
      return res
        .status(401)
        .json({ msg: "Esta cuenta ya se verificó", success: false });
    }

    const OTP = generateOTP();
    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: user.email,
      subject: "Por favor, verifica tu correo electrónico",
      html: generateSendOTPTemplate(OTP),
    });

    //Hacemos un Hash del OTP y lo guardamos en JWT por 10 min
    const hastOTP = await generateHashPassOrToken(OTP);
    const jwtToken = await jwtVerifyEmail(hastOTP);

    return res.json({ user: user, token: jwtToken });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
};
