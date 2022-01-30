const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "El usuario requiere un nombre"],
      minlength: [3, "Mínimo 3 caracteres"],
    },
    lastName: {
      type: String,
      required: [true, "El usuario requiere un apellido"],
      minlength: [3, "Mínimo 3 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El usuario requiere un e-mail válido"],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Por favor, ingrese un correo válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "6 characters min"],
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "admin"],
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

//Convertir el esquema en modelo y exportarlo
const UserModel = model("UserModel", UserSchema);
module.exports = UserModel;
