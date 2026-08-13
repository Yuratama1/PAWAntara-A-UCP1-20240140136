const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Admin = sequelize.define(
        "Admin",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },

            password: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            role: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "admin"
            }
        },
        {
            tableName: "admins",
            timestamps: true
        }
    );

    return Admin;
};