const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { sequelize } = require("../config/db");

const Product = require("../models/products")(sequelize);
const Admin = require("../models/admin")(sequelize);

const requireAuth = require("../middleware/auth");

// ======================
// POST /api/login
// ======================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "error",
                message: "Username dan password wajib diisi"
            });
        }

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
            console.error("Logout error:", error);

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
// PUBLIC
// ======================
router.get("/products", async (req, res) => {

    try {

        const products = await Product.findAll({
            order: [
                ["id", "ASC"]
            ]
        });

        return res.status(200).json({
            status: "success",
            message: "Data produk berhasil diambil",
            data: products
        });

    } catch (error) {

        console.error(
            "GET products error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message: "Gagal mengambil data produk"
        });
    }

});

// ======================
// GET /api/products/:id
// PUBLIC
// ======================
router.get("/products/:id", async (req, res) => {

    try {

        const id = parseInt(
            req.params.id,
            10
        );

        if (Number.isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "ID produk tidak valid"
            });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Detail produk berhasil diambil",
            data: product
        });

    } catch (error) {

        console.error(
            "GET product detail error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message: "Gagal mengambil detail produk"
        });
    }

});

// ======================
// POST /api/products
// ADMIN ONLY
// ======================
router.post(
    "/products",
    requireAuth,
    async (req, res) => {

        try {

            const {
                name,
                category,
                price,
                stock
            } = req.body;

            if (
                !name ||
                !category ||
                price === undefined ||
                stock === undefined
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "Nama, kategori, harga, dan stok wajib diisi"
                });
            }

            const product = await Product.create({
                name: name.trim(),
                category: category.trim(),
                price: Number(price),
                stock: Number(stock)
            });

            return res.status(201).json({
                status: "success",
                message: "Produk berhasil ditambahkan",
                data: product
            });

        } catch (error) {

            console.error("POST product error:");
            console.error(error);

            if (error.errors) {
                console.error(
                    "Validation details:",
                    error.errors.map((item) => ({
                        message: item.message,
                        path: item.path,
                        value: item.value,
                        validatorKey: item.validatorKey
                    }))
                );
            }

            return res.status(500).json({
                status: "error",
                message: "Gagal menambahkan produk",
                error: error.message,
                details: error.errors
                    ? error.errors.map((item) => ({
                        message: item.message,
                        field: item.path
                    }))
                    : []
            });
        }

    }
);

// ======================
// PUT /api/products/:id
// ADMIN ONLY
// ======================
router.put(
    "/products/:id",
    requireAuth,
    async (req, res) => {

        try {

            const id = parseInt(
                req.params.id,
                10
            );

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "ID produk tidak valid"
                });
            }

            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Produk tidak ditemukan"
                });
            }

            const {
                name,
                category,
                price,
                stock
            } = req.body;

            if (
                !name ||
                !category ||
                price === undefined ||
                stock === undefined
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "Nama, kategori, harga, dan stok wajib diisi"
                });
            }

            await product.update({
                name: name.trim(),
                category: category.trim(),
                price: Number(price),
                stock: Number(stock)
            });

            return res.status(200).json({
                status: "success",
                message: "Produk berhasil diperbarui",
                data: product
            });

        } catch (error) {

            console.error(
                "PUT product error:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Gagal memperbarui produk"
            });
        }

    }
);

// ======================
// DELETE /api/products/:id
// ADMIN ONLY
// ======================
router.delete(
    "/products/:id",
    requireAuth,
    async (req, res) => {

        try {

            const id = parseInt(
                req.params.id,
                10
            );

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "ID produk tidak valid"
                });
            }

            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Produk tidak ditemukan"
                });
            }

            await product.destroy();

            return res.status(200).json({
                status: "success",
                message: "Produk berhasil dihapus",
                data: {
                    id
                }
            });

        } catch (error) {

            console.error(
                "DELETE product error:",
                error
            );

            return res.status(500).json({
                status: "error",
                message: "Gagal menghapus produk"
            });
        }

    }
);

module.exports = router;