require("dotenv").config();

const bcrypt = require("bcrypt");

const { sequelize } = require("../config/db");

const Product = require("../models/products")(sequelize);
const Admin = require("../models/admin")(sequelize);

const products = [
    {
        id: 1,
        name: "Beras Premium 5 Kg",
        category: "Beras",
        price: 78000,
        stock: 25
    },
    {
        id: 2,
        name: "Minyak Goreng Bimoli 2L",
        category: "Minyak Goreng",
        price: 42000,
        stock: 18
    },
    {
        id: 3,
        name: "Gula Pasir Gulaku 1 Kg",
        category: "Gula",
        price: 19000,
        stock: 40
    },
    {
        id: 4,
        name: "Tepung Segitiga Biru 1 Kg",
        category: "Tepung",
        price: 16000,
        stock: 35
    },
    {
        id: 5,
        name: "Indomie Goreng",
        category: "Mie Instan",
        price: 3500,
        stock: 120
    },
    {
        id: 6,
        name: "Telur Ayam Ras 1 Kg",
        category: "Telur",
        price: 32000,
        stock: 30
    },
    {
        id: 7,
        name: "Aqua 600 ml",
        category: "Minuman",
        price: 4000,
        stock: 100
    },
    {
        id: 8,
        name: "Royco Ayam",
        category: "Bumbu Dapur",
        price: 2500,
        stock: 80
    },
    {
        id: 9,
        name: "Rinso Anti Noda 800 gr",
        category: "Kebutuhan Rumah",
        price: 28000,
        stock: 20
    }
];

async function seedDatabase() {
    try {
        await sequelize.authenticate();

        console.log("PostgreSQL connected.");

        await sequelize.sync();

        console.log("Database synchronized.");

        // =========================
        // SEED ADMIN
        // =========================

        const existingAdmin = await Admin.findOne({
            where: {
                username: "admin"
            }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(
                "admin123",
                10
            );

            await Admin.create({
                username: "admin",
                password: hashedPassword,
                role: "admin"
            });

            console.log("Akun admin berhasil dibuat.");
        } else {
            console.log("Akun admin sudah tersedia.");
        }

        // =========================
        // SEED PRODUCTS
        // =========================

        const existingProducts = await Product.count();

        if (existingProducts > 0) {
            console.log(
                `Data produk sudah tersedia. Total: ${existingProducts}`
            );
        } else {
            await Product.bulkCreate(products);

            console.log("Data produk berhasil dimasukkan.");

            const totalProducts = await Product.count();

            console.log(
                `Total produk di database: ${totalProducts}`
            );
        }

        console.log("Seed database selesai.");
    } catch (error) {
        console.error(
            "Gagal melakukan seed database:",
            error.message
        );
    } finally {
        await sequelize.close();
    }
}

seedDatabase();