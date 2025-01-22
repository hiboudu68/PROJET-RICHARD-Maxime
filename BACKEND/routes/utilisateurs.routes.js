const { checkJwt } = require("./jwtMiddleware.js");

module.exports = app => {
    const user = require("../controllers/utilisateurs.controllers.js");
  
    let router = require("express").Router();

    router.get("/", checkJwt, user.get);
    router.post("/", checkJwt, user.getUserFromToken);
    router.put("/", checkJwt, user.updateUser);
    router.post("/login", user.login);
    router.post("/register", user.register);
  
    app.use('/api/utilisateur', router);
  };
