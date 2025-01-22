const { checkJwt } = require("./jwtMiddleware.js");

module.exports = app => {
    const produits = require("../controllers/produit.controllers.js");

    let router = require("express").Router();
    
    router.get("/", checkJwt, produits.get);
    
    app.use('/api/produits', router);
  };
