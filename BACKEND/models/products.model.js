module.exports = (sequelize, Sequelize) => {
    const Products = sequelize.define("products", { 
        id: {
            type: Sequelize.NUMBER,
            primaryKey:true,
            allowNull: false
            },  
        nom: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },    
        prix: {
            type: Sequelize.NUMBER,
        }
    });

    return Products;
};