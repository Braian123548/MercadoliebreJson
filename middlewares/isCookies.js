const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../database/users.json');

const readUsersFile = () => {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const isCookie = async (req, res, next) => {
  try {
    if (req.cookies.recordame) {
      const usersData = readUsersFile();
      const usuario = usersData.find(user => user.nombreUsuario === req.cookies.recordame);
      
      if (usuario) {
        if (usuario.perfil === 'vendedor') {
          req.session.vendedor = usuario;
        } else if (usuario.perfil === 'comprador') {
          req.session.comprador = usuario;
        }
      }
    }
    next();
  } catch (error) {
    console.error("Error al buscar el usuario en la base de datos:", error);
    next(error);
  }
}

module.exports = {
  isCookie
};
