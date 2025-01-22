const { checkJwt } = require("./jwtMiddleware.js");

module.exports = app => {
    const card = require("../controllers/creditcards.controllers.js");
  
    let router = require("express").Router();

    router.get("/", checkJwt, card.get);
    router.put("/", checkJwt, card.updateCard);
    router.post("/", card.addCard);
    router.delete("/:id", card.deleteCard);
  
    app.use('/api/cards', router);
  };