const { ACCESS_TOKEN_SECRET }  = require ("../config.js");

const jwt = require('jsonwebtoken');

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

const db = require("../models");
const Produits = db.produits;
const Op = db.Sequelize.Op;


exports.get = (req, res) => {
    Produits.findAll()
    .then(data => {
        console.log(data)
        res.send(data);
    })
    .catch(err => {
        res.status(404).send({
            message: "Error retrieving cartes :", err
        });
    });
};



