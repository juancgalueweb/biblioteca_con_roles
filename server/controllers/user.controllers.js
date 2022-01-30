const UserModel = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const bcrypt = require("bcryptjs");
const { genJWT } = require("../helpers/jwt");
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
} = require("../helpers/mailVerify");
const { isValidObjectId } = require("mongoose");

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
    //Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hash;

    const OTP = generateOTP();

    const verificationToken = new VerificationToken({
      owner: newUser._id,
      token: OTP,
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
    if (!user) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }
    const { _id, firstName, email, password, role } = user;
    const validPassword = bcrypt.compareSync(req.body.password, password);
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
  const { userId, otp } = req.body;
  if (!userId || !otp.trim()) {
    return res.status(401).json({ msg: "Solicitud inválida", success: false });
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
      .json({ msg: "Usuario no encontrado 2", success: false });
  }

  const isMatched = await token.compareToken(otp);
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
};
