const express = require("express");

const router = express.Router();

const {
    sequelize
} = require("../config/db");

const Product =
    require("../models/products")(sequelize);

const requireAuth =
    require("../middleware/auth");


// ======================================================
// LOGIN
// ======================================================

router.get(
    "/login",
    (req, res) => {

        // Jika admin sudah login,
        // langsung arahkan ke dashboard
        if (
            req.session &&
            req.session.admin
        ) {

            return res.redirect(
                "/dashboard"
            );

        }

        return res.render(
            "login",
            {
                title: "Login",
                currentPage: "login"
            }
        );

    }
);


// ======================================================
// DASHBOARD ADMIN
// PROTECTED
// ======================================================

router.get(
    "/dashboard",
    requireAuth,
    (req, res) => {

        return res.render(
            "dashboard",
            {
                title: "Dashboard",
                currentPage: "dashboard",
                admin:
                    req.session.admin
            }
        );

    }
);


// ======================================================
// BERANDA
// PUBLIC
// ======================================================

router.get(
    "/",
    async (req, res, next) => {

        try {

            // Ambil 3 produk terbaru berdasarkan ID
            const products =
                await Product.findAll({
                    order: [
                        ["id", "ASC"]
                    ],
                    limit: 3
                });

            return res.render(
                "home",
                {
                    title: "Beranda",
                    currentPage: "home",
                    products
                }
            );

        } catch (error) {

            console.error(
                "Home products error:",
                error
            );

            next(error);

        }

    }
);


// ======================================================
// HALAMAN PRODUK
// PUBLIC
//
// Sprint 2:
// Data produk ditampilkan melalui Fetch API
// dari GET /api/products
// ======================================================

router.get(
    "/produk",
    (req, res) => {

        return res.render(
            "products",
            {
                title:
                    "Daftar Produk",

                currentPage:
                    "produk"
            }
        );

    }
);


// ======================================================
// DETAIL PRODUK
// PUBLIC
// ======================================================

router.get(
    "/produk/:id",
    async (req, res, next) => {

        try {

            const id =
                parseInt(
                    req.params.id,
                    10
                );


            // ======================
            // VALIDASI ID
            // ======================

            if (
                Number.isNaN(id)
            ) {

                return res.status(404).render(
                    "notfound",
                    {
                        title:
                            "Produk Tidak Ditemukan",

                        currentPage:
                            "produk"
                    }
                );

            }


            // ======================
            // CARI PRODUK DI DATABASE
            // ======================

            const product =
                await Product.findByPk(id);


            // ======================
            // PRODUK TIDAK DITEMUKAN
            // ======================

            if (!product) {

                return res.status(404).render(
                    "notfound",
                    {
                        title:
                            "Produk Tidak Ditemukan",

                        currentPage:
                            "produk"
                    }
                );

            }


            // ======================
            // TAMPILKAN DETAIL
            // ======================

            return res.render(
                "detail",
                {
                    title:
                        product.name,

                    currentPage:
                        "produk",

                    product
                }
            );

        } catch (error) {

            console.error(
                "Product detail error:",
                error
            );

            next(error);

        }

    }
);


// ======================================================
// TANYA AI
// PUBLIC
// ======================================================

router.get(
    "/tanya-ai",
    (req, res) => {

        return res.render(
            "ai",
            {
                title:
                    "Tanya AI",

                currentPage:
                    "ai"
            }
        );

    }
);


module.exports = router;