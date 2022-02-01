const UserModel = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const { genJWT } = require("../helpers/jwt");
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  generatePasswordResetTemplate,
} = require("../helpers/mailVerify");
const { isValidObjectId } = require("mongoose");
const ResetTokenModel = require("../models/resetToken.model");
const { createRandomBytes } = require("../helpers/randomBytes");
const {
  generateHashPassOrToken,
  comparePassOrToken,
} = require("../helpers/hashPassOrToken");

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

    const OTP = generateOTP();
    const hastOTP = await generateHashPassOrToken(OTP);

    const verificationToken = new VerificationToken({
      owner: newUser._id,
      token: hastOTP,
    });

    await verificationToken.save();
    await newUser.save();

    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: newUser.email,
      subject: "Por favor, verifica tu correo electrónico",
      html: generateEmailTemplate(OTP),
    });

    return res.json(newUser);
  } catch (err) {
    const errorMsg = Object.values(err.errors).map((val) => val.message);
    res.status(500).json(errorMsg);
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
        .json({ success: false, msg: "Su email no ha sido verificado" });
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
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }
  } catch (err) {
    res.status(403).json({ msg: "Credenciales inválidas", err });
  }
};

//Método para verificar el correo electrónico
module.exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp.trim()) {
      return res
        .status(401)
        .json({ msg: "Solicitud inválida", success: false });
    }

    if (!isValidObjectId(userId)) {
      return res.status(401).json({ msg: "userId inválida", success: false });
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

    const token = await VerificationToken.findOne({ owner: user._id });
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    const isMatched = comparePassOrToken(otp, token.token);
    if (!isMatched) {
      return res.status(401).json({ msg: "Token inválido", success: false });
    }

    user.verified = true;

    await VerificationToken.findByIdAndDelete(token._id);
    await user.save();

    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: user.email,
      subject: "Verificación exitosa",
      html: "<h1>La verificación del email fue un éxito. Gracias.</h1>",
    });
    res.json({
      success: true,
      msg: "Su correo fue verificado",
      user: {
        name: user.firstName,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ errorMsg: err });
  }
};

//Controlador para olvido de contraseña
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ msg: "Email inválido", success: false });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Usuario no encontrado", success: false });
    }

    const token = await ResetTokenModel.findOne({ owner: user._id });
    if (token) {
      return res.status(401).json({
        msg: "Solo después de 1 hora puedes pedir otro token",
        success: false,
      });
    }

    const randomToken = await createRandomBytes();
    const hashRandomToken = await generateHashPassOrToken(randomToken);
    const resetToken = new ResetTokenModel({
      owner: user._id,
      token: hashRandomToken,
    });
    await resetToken.save();

    mailTransport().sendMail({
      from: "security@email.com",
      to: user.email,
      subject: "Reseteo de contraseña",
      html: generatePasswordResetTemplate(
        `http://localhost:3000/reset-password?token=${randomToken}&id=${user._id}`
      ),
    });

    res.json({
      success: true,
      msg: "Se envió a su e-mail el link para resetear la contraseña",
    });
  } catch (err) {
    res.status(500).json({ errorMsg: err });
  }
};

//Contolador para resetear la contraseña
module.exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await UserModel.findById(req.user._id);
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
    await ResetTokenModel.findOneAndDelete({ owner: user._id });

    mailTransport().sendMail({
      from: "security@email.com",
      to: user.email,
      subject: "Reseteo de contraseña exitoso",
      html: "<h1>El reseteo de la contraseña fue exitoso, ahora puede iniciar sesión con la nueva contraseña.</h1>",
    });

    res.json({ success: true, msg: "Reseteo de contraseña exitoso" });
  } catch (err) {
    res.status(500).json({ errorMsg: err });
  }
};
