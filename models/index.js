const { sequelize } = require("../config/db");

const db = {};

db.sequelize = sequelize;

db.Product = require("./product")(sequelize);
db.Admin = require("./admin")(sequelize);

module.exports = db;