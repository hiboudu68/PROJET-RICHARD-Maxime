module.exports = (sequelize, Sequelize) => {
  const Utilisateurs = sequelize.define("utilisateurs", {
    lastname: {
      type: Sequelize.STRING
    }, 
    firstname: {
      type: Sequelize.STRING,
    },   
    login: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    }
 });
return Utilisateurs;
};
