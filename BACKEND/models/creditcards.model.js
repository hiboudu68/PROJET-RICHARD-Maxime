module.exports = (sequelize, Sequelize) => {
    const CreditCards = sequelize.define("creditCards", { 
        name: {
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
        },    
        ccv: {
            type: Sequelize.STRING,
        },
        date: {
            type: Sequelize.STRING,
        },
        idUser: {
            type: Sequelize.NUMBER,
            allowNull: false
        }
    });

    return CreditCards;
};