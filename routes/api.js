const express = require("express");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const router = express.Router();

const { sequelize } = require("../config/db");

const Product = require("../models/products")(sequelize);
const Admin = require("../models/admin")(sequelize);

const requireAuth = require("../middleware/auth");


// ======================================================
// POST /api/login
// ======================================================
router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        // ======================
        // VALIDASI INPUT
        // ======================
        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {

            return res.status(400).json({
                status: "error",
                message: "Username dan password wajib diisi"
            });

        }

        // ======================
        // CARI ADMIN
        // ======================
        const admin = await Admin.findOne({
            where: {
                username: username.trim()
            }
        });

        // ======================
        // CEK USERNAME
        // ======================
        if (!admin) {

            return res.status(401).json({
                status: "error",
                message: "Username atau password salah"
            });

        }

        // ======================
        // CEK PASSWORD
        // ======================
        const passwordMatch =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                status: "error",
                message: "Username atau password salah"
            });

        }

        // ======================
        // REGENERATE SESSION
        // ======================
        req.session.regenerate((error) => {

            if (error) {

                console.error(
                    "Session regenerate error:",
                    error
                );

                return res.status(500).json({
                    status: "error",
                    message: "Gagal membuat session login"
                });

            }

            // ======================
            // SIMPAN SESSION ADMIN
            // ======================
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

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server"
        });

    }

});


// ======================================================
// POST /api/logout
// ======================================================
router.post("/logout", (req, res) => {

    // ======================
    // SESSION TIDAK ADA
    // ======================
    if (!req.session) {

        return res.status(200).json({
            status: "success",
            message: "Logout berhasil"
        });

    }

    // ======================
    // DESTROY SESSION
    // ======================
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

        // ======================
        // HAPUS COOKIE SESSION
        // ======================
        res.clearCookie(
            "connect.sid",
            {
                httpOnly: true,
                sameSite: "lax"
            }
        );

        return res.status(200).json({
            status: "success",
            message: "Logout berhasil"
        });

    });

});


// ======================================================
// GET /api/products
// PUBLIC
// SUPPORT SEARCH + CATEGORY FILTER
// ======================================================

router.get(
    "/products",
    async (req, res) => {

        try {

            // ======================
            // QUERY STRING
            // ======================

            const search =
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : "";

            const kategori =
                typeof req.query.kategori === "string"
                    ? req.query.kategori.trim()
                    : "";


            // ======================
            // FILTER DATABASE
            // ======================

            const where = {};


            // ======================
            // SEARCH NAMA PRODUK
            // ======================

            if (search) {

                where.name = {
                    [Op.iLike]:
                        `%${search}%`
                };

            }


            // ======================
            // FILTER KATEGORI
            // ======================

            if (kategori) {

                where.category = {
                    [Op.iLike]:
                        kategori
                };

            }


            // ======================
            // AMBIL DATA
            // ======================

            const products =
                await Product.findAll({

                    where,

                    order: [
                        ["id", "ASC"]
                    ]

                });


            // ======================
            // RESPONSE
            // ======================

            return res.status(200).json({

                status:
                    "success",

                message:
                    "Data produk berhasil diambil",

                data:
                    products

            });

        } catch (error) {

            console.error(
                "GET products error:",
                error
            );

            return res.status(500).json({

                status:
                    "error",

                message:
                    "Gagal mengambil data produk"

            });

        }

    }
);


// ======================================================
// GET /api/products/:id
// PUBLIC
// ======================================================
router.get("/products/:id", async (req, res) => {

    try {

        const id = parseInt(
            req.params.id,
            10
        );

        // ======================
        // VALIDASI ID
        // ======================
        if (Number.isNaN(id)) {

            return res.status(400).json({
                status: "error",
                message: "ID produk tidak valid"
            });

        }

        // ======================
        // CARI PRODUK
        // ======================
        const product =
            await Product.findByPk(id);

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


// ======================================================
// POST /api/products
// ADMIN ONLY
// ======================================================
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

            // ======================
            // VALIDASI FIELD WAJIB
            // ======================
            if (
                !name ||
                !category ||
                price === undefined ||
                stock === undefined
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Nama, kategori, harga, dan stok wajib diisi"
                });

            }

            // ======================
            // VALIDASI NAMA
            // ======================
            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Nama produk tidak valid"
                });

            }

            // ======================
            // VALIDASI KATEGORI
            // ======================
            if (
                typeof category !== "string" ||
                !category.trim()
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Kategori produk tidak valid"
                });

            }

            // ======================
            // VALIDASI HARGA
            // ======================
            const numericPrice =
                Number(price);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Harga harus berupa angka yang valid dan tidak boleh negatif"
                });

            }

            // ======================
            // VALIDASI STOK
            // ======================
            const numericStock =
                Number(stock);

            if (
                !Number.isInteger(numericStock) ||
                numericStock < 0
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Stok harus berupa bilangan bulat yang valid dan tidak boleh negatif"
                });

            }

            // ======================
            // CREATE PRODUCT
            // ======================
            const product =
                await Product.create({
                    name: name.trim(),
                    category: category.trim(),
                    price: numericPrice,
                    stock: numericStock
                });

            return res.status(201).json({
                status: "success",
                message:
                    "Produk berhasil ditambahkan",
                data: product
            });

        } catch (error) {

            console.error(
                "POST product error:",
                error
            );

            return res.status(500).json({
                status: "error",
                message:
                    "Gagal menambahkan produk"
            });

        }

    }
);


// ======================================================
// PUT /api/products/:id
// ADMIN ONLY
// ======================================================
router.put(
    "/products/:id",
    requireAuth,
    async (req, res) => {

        try {

            const id = parseInt(
                req.params.id,
                10
            );

            // ======================
            // VALIDASI ID
            // ======================
            if (Number.isNaN(id)) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "ID produk tidak valid"
                });

            }

            // ======================
            // CARI PRODUK
            // ======================
            const product =
                await Product.findByPk(id);

            if (!product) {

                return res.status(404).json({
                    status: "error",
                    message:
                        "Produk tidak ditemukan"
                });

            }

            const {
                name,
                category,
                price,
                stock
            } = req.body;

            // ======================
            // VALIDASI FIELD WAJIB
            // ======================
            if (
                !name ||
                !category ||
                price === undefined ||
                stock === undefined
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Nama, kategori, harga, dan stok wajib diisi"
                });

            }

            // ======================
            // VALIDASI NAMA
            // ======================
            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Nama produk tidak valid"
                });

            }

            // ======================
            // VALIDASI KATEGORI
            // ======================
            if (
                typeof category !== "string" ||
                !category.trim()
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Kategori produk tidak valid"
                });

            }

            // ======================
            // VALIDASI HARGA
            // ======================
            const numericPrice =
                Number(price);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Harga harus berupa angka yang valid dan tidak boleh negatif"
                });

            }

            // ======================
            // VALIDASI STOK
            // ======================
            const numericStock =
                Number(stock);

            if (
                !Number.isInteger(numericStock) ||
                numericStock < 0
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Stok harus berupa bilangan bulat yang valid dan tidak boleh negatif"
                });

            }

            // ======================
            // UPDATE PRODUCT
            // ======================
            await product.update({
                name: name.trim(),
                category: category.trim(),
                price: numericPrice,
                stock: numericStock
            });

            return res.status(200).json({
                status: "success",
                message:
                    "Produk berhasil diperbarui",
                data: product
            });

        } catch (error) {

            console.error(
                "PUT product error:",
                error
            );

            return res.status(500).json({
                status: "error",
                message:
                    "Gagal memperbarui produk"
            });

        }

    }
);


// ======================================================
// DELETE /api/products/:id
// ADMIN ONLY
// ======================================================
router.delete(
    "/products/:id",
    requireAuth,
    async (req, res) => {

        try {

            const id = parseInt(
                req.params.id,
                10
            );

            // ======================
            // VALIDASI ID
            // ======================
            if (Number.isNaN(id)) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "ID produk tidak valid"
                });

            }

            // ======================
            // CARI PRODUK
            // ======================
            const product =
                await Product.findByPk(id);

            if (!product) {

                return res.status(404).json({
                    status: "error",
                    message:
                        "Produk tidak ditemukan"
                });

            }

            // ======================
            // DELETE
            // ======================
            await product.destroy();

            return res.status(200).json({
                status: "success",
                message:
                    "Produk berhasil dihapus",
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
                message:
                    "Gagal menghapus produk"
            });

        }

    }
);


// ======================================================
// POST /api/chat
// PUBLIC - DUMMY AI
// ======================================================
router.post("/chat", async (req, res) => {

    try {

        const {
            question
        } = req.body;

        // ======================
        // VALIDASI
        // ======================
        if (
            typeof question !== "string" ||
            !question.trim()
        ) {

            return res.status(400).json({
                status: "error",
                message:
                    "Pertanyaan wajib diisi"
            });

        }

        const userQuestion =
            question.trim();

        const lowerQuestion =
            userQuestion.toLowerCase();

        let answer;


        // ======================
        // JAM BUKA
        // ======================
        if (
            lowerQuestion.includes("jam buka") ||
            lowerQuestion.includes("buka jam") ||
            lowerQuestion.includes("jam berapa") ||
            lowerQuestion.includes("buka")
        ) {

            answer =
                "Toko Ariesta buka setiap hari pukul 08.00 sampai 21.00.";

        }


        // ======================
        // ONGKIR / PENGANTARAN
        // ======================
        else if (
            lowerQuestion.includes("ongkir") ||
            lowerQuestion.includes("antar") ||
            lowerQuestion.includes("pengantaran") ||
            lowerQuestion.includes("delivery")
        ) {

            answer =
                "Untuk informasi ongkir dan area pengantaran, silakan hubungi Toko Ariesta secara langsung.";

        }


        // ======================
        // PEMBAYARAN
        // ======================
        else if (
            lowerQuestion.includes("bayar") ||
            lowerQuestion.includes("pembayaran") ||
            lowerQuestion.includes("payment")
        ) {

            answer =
                "Toko Ariesta menerima pembayaran sesuai metode pembayaran yang tersedia di toko.";

        }


        // ======================
        // CARI PRODUK / STOK
        // ======================
        else if (
            lowerQuestion.includes("stok") ||
            lowerQuestion.includes("tersedia") ||
            lowerQuestion.includes("ada")
        ) {

            const products =
                await Product.findAll({
                    order: [
                        ["name", "ASC"]
                    ]
                });

            const matchedProduct =
                products.find(product =>
                    lowerQuestion.includes(
                        product.name.toLowerCase()
                    )
                );

            if (matchedProduct) {

                if (matchedProduct.stock > 0) {

                    answer =
                        `${matchedProduct.name} masih tersedia dengan stok ${matchedProduct.stock} item.`;

                } else {

                    answer =
                        `${matchedProduct.name} sedang tidak tersedia karena stok habis.`;

                }

            } else {

                const availableProducts =
                    products.filter(
                        product =>
                            product.stock > 0
                    );

                if (
                    availableProducts.length === 0
                ) {

                    answer =
                        "Saat ini belum ada produk yang tersedia.";

                } else {

                    const productList =
                        availableProducts
                            .slice(0, 5)
                            .map(product =>
                                `${product.name} (stok ${product.stock})`
                            )
                            .join(", ");

                    answer =
                        `Beberapa produk yang tersedia saat ini: ${productList}.`;

                }

            }

        }


        // ======================
        // DEFAULT
        // ======================
        else {

            answer =
                "Maaf, saya belum memahami pertanyaan tersebut. Kamu bisa bertanya tentang jam buka, stok produk, pengantaran, atau pembayaran.";

        }


        return res.status(200).json({
            status: "success",
            message:
                "Pertanyaan berhasil diproses",
            data: {
                question: userQuestion,
                answer
            }
        });

    } catch (error) {

        console.error(
            "Chat error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message:
                "Gagal memproses pertanyaan"
        });

    }

});


module.exports = router;