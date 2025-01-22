const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');
const sequelize = new Sequelize(`postgres://${BDD.user}:${BDD.password}@${BDD.host}:${BDD.port}/${BDD.bdname}`
,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true,
      native:true
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);
db.creditCards = require("./creditcards.model.js")(sequelize, Sequelize);
db.produits = require("./products.model.js")(sequelize, Sequelize);

module.exports = db;
