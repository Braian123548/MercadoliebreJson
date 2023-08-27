const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');

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

const writeUsersFile = (data) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

const register = {
  get: (req, res) => {
    res.render('register');
  },
  post: async (req, res) => {
    const { nombreApellido, userName, emailUsuario, fechaUsuario, domicilioUsuario, interes, password, perfil } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        _id: uuidv4(), // Generar un ID único para el nuevo usuario
        nombreApellido,
        nombreUsuario: userName,
        password: hashedPassword,
        email: emailUsuario,
        fechaNacimiento: fechaUsuario,
        perfil,
        domicilio: domicilioUsuario,
        intereses: interes,
      };

      const users = readUsersFile();
      users.push(newUser);
      writeUsersFile(users);
  
      res.redirect('/users/register');
  },
};

const login = {
  get: (req, res) => {
    res.render('login');
  },
  post: async (req, res) => {
    const { nombreUsuario, password, recordame } = req.body;

    const users = readUsersFile();
    const usuario = users.find(user => user.nombreUsuario === nombreUsuario);
        console.log(usuario);
    if (usuario) {
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      if (passwordMatch) {
        if (usuario.perfil === 'vendedor') {
          req.session.vendedor = usuario;
        } else if (usuario.perfil === 'comprador') {
          req.session.comprador = usuario;
        }
      }
    }

    if (recordame) {
      res.cookie('recordame', usuario.nombreUsuario);
    }

    res.redirect('/');
  },
};



module.exports = {
  register,
  login,
  
};
