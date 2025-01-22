const { ACCESS_TOKEN_SECRET }  = require ("../config.js");

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '365d' });
}

const decodedAccessToken = (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);;
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

function getUserFromToken(req) {
  return Utilisateurs.findOne({ where: { id: decodedAccessToken(req).id } });
}

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
  
  const user = decodedAccessToken(req);

  Utilisateurs.findOne({ where: { id: user.id } })
  .then(data => {
    if (data) {
      const user = {
        id: data.id,
        name: data.nom,
        email: data.email
      };

      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Utilisateur with login=${user.id}.`
      });
    }
  })
  .catch(err => {
    res.status(400).send({
      message: "Error retrieving Utilisateur with login=" + utilisateur.login
    });
  });

};

exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
    Utilisateurs.findOne({ where: { login: utilisateur.login } })
    .then(data => {
      if (data) {
        const user = {
          id: data.id,
          name: data.nom,
          email: data.email
        };
     
        let accessToken = generateAccessToken(user);
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.status(200).json({accessToken, data});
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with login=${utilisateur.login}.`
        });
      }
    })
    .catch(err => {
      res.status(400).send({
        message: "Error retrieving Utilisateur with login=" + utilisateur.login
      });
    });
  } else {
    res.status(400).send({
      message: "Login ou password incorrect" 
    });
  }
};

exports.register = (req, res) => {
  const newUser = {
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    login: req.body.login,
    password: req.body.password,
    email: req.body.email
  };
  
  Utilisateurs.findOne({ where: { login: newUser.login } })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Ce login est déjà utilisé.' });
      }
      return Utilisateurs.create(newUser);
    })
    .then(user => {
      res.status(201).json({ message: 'Utilisateur créé avec succès.', user });
    })
    .catch(error => {
      console.error('Erreur lors de la création de l utilisateur :', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    });
  
}

exports.getUserFromToken = (req, res) => {
  const user = getUserFromToken(req);
  if (!user) {
      return res.status(404).json({ message: 'Utilisateur inexistant' });
  }
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await getUserFromToken(req);
  if (!user) {
      return res.status(404).json({ message: 'Utilisateur inexistant' });
  }

  Utilisateurs.update(
    { lastname: req.body.lastname, 
      firstname: req.body.firstname, 
      login: req.body.login ,
      password: req.body.password ,
      email: req.body.email},
    { where: {id: user.dataValues.id}}
  )
  .then(([rowsUpdated]) => {
      if (rowsUpdated === 0) {
        res.status(500).json({ message:'No user found with the specified ID.'});
      }
      else {
        res.status(200);
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error updating user.' });
    });

  res.json(user);
};
