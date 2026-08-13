const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { sequelize } = require("../config/db");
const Product = require("../models/products")(sequelize);
const Admin = require("../models/admin")(sequelize);

const products = require("../data/products");

// ======================
// POST /api/login
// ======================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi backend
        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username dan password wajib diisi"
            });
        }

        // Cari admin berdasarkan username
        const admin = await Admin.findOne({
            where: {
                username
            }
        });

        if (!admin) {
            return res.status(401).json({
                status: "error",
                message: "Username atau password salah"
            });
        }

        // Cek password menggunakan bcrypt
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                status: "error",
                message: "Username atau password salah"
            });
        }

        // Simpan informasi login ke session
        req.session.admin = {
            id: admin.id,
            username: admin.username,
            role: admin.role
        };

        return res.status(200).json({
            status: "success",
            message: "Login berhasil",
            data: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server"
        });
    }
});

// ======================
// POST /api/logout
// ======================
router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Gagal melakukan logout"
            });

        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            status: "success",
            message: "Logout berhasil"
        });

    });

});

// ======================
// GET /api/products
// ======================
router.get("/products", (req, res) => {

    res.json({
        status: "success",
        message: "Data produk berhasil diambil",
        data: products
    });

});

module.exports = router;