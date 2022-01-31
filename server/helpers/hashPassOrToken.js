const bcrypt = require("bcryptjs");

//Función que encripta un string usando bcrypt
module.exports.generateHashPassOrToken = (string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(string, salt);
  string = hash;
  return string;
};

//Función que compara el string ingresado con el string encriptado que está en la base de datos
module.exports.comparePassOrToken = (input, hashString) => {
  return bcrypt.compareSync(input, hashString);
};
