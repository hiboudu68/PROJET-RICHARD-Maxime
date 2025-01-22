module.exports = app => {  
    require("./creditcards.routes")(app);
    require("./utilisateurs.routes")(app);
    require("./produit.routes")(app);
}