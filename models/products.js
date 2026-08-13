const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            category: {
                type: DataTypes.STRING(50),
                allowNull: false
            },

            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
            },

            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                }
            }
        },
        {
            tableName: "products",
            timestamps: true
        }
    );

    return Product;
};