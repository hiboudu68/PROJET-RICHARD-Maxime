const { v4: uuidv4 } = require ("uuid");
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
const CreditCards = db.creditCards;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
    CreditCards.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(404).send({
            message: "Error retrieving cartes :", err
        });
    });
};

exports.addCard = (req, res) => {
    const newCard = {
        name: req.body.name,
        code: req.body.code,
        ccv: req.body.ccv,
        date: req.body.date,
        idUser: decodedAccessToken(req,res).id
    };

    CreditCards.findOne({ where: { name: newCard.name } })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Cette carte existe déjà.' });
      }
      return CreditCards.create(newCard);
    })
    .then(card => {
        res.status(201).json({ message: 'Carte créé avec succès.', card });
    })
    .catch(error => {
        res.status(500).json({ message: 'Erreur lors de la création de la carte :', error });
    });
}

exports.deleteCard = (req, res) => {

    CreditCards.findOne({where: {id: req.params.id}})
    .then(card => {
        if (!card) {
            return res.status(404).json({ message: 'Carte de crédit inexistante' });
        }
    })

    CreditCards.destroy({
        where: {id: req.params.id},
    })
    .then(card => {
        res.status(201).json({ message: 'Carte supprimer avec succès.', card });
    })
    .catch(error => {
        res.status(500).json({ message: 'Erreur lors de la suppression de la carte :', error });
    });
    
};

exports.updateCard = async (req, res) => {
    let user = await decodedAccessToken(req, res);
    console.log(req.body)
    console.log(user)

    CreditCards.update(
        { name: req.body.name,
          code: req.body.code,
          ccv: req.body.ccv,
          date: req.body.date,
          idUser: user.id},
        { where: {id: req.body.id}}
      ).then(([rowsUpdated]) => {
        if (rowsUpdated === 0) {
          res.status(500).json({ message:'No carte found with the specified ID.'});
        }
        else {
          return res.status(200);
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error updating carte.' });
      });
};


