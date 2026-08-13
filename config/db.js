const { Sequelize } = require("sequelize");
const config = require("./config").development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: false
    }
);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();

        console.log("PostgreSQL connected successfully.");

        await sequelize.sync();

        console.log("Database synchronized.");
    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectToDatabase
};