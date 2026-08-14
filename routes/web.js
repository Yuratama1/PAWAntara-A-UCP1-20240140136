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
// ======================================================

router.get(
    "/produk",
    async (req, res, next) => {

        try {

            // ======================
            // AMBIL QUERY STRING
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
            // AMBIL SEMUA KATEGORI
            // ======================

            const categoryRows =
                await Product.findAll({
                    attributes: [
                        "category"
                    ],
                    group: [
                        "category"
                    ],
                    order: [
                        ["category", "ASC"]
                    ],
                    raw: true
                });


            const categories =
                categoryRows
                    .map(
                        item =>
                            item.category
                    )
                    .filter(Boolean);


            // ======================
            // RENDER HALAMAN
            // ======================

            return res.render(
                "products",
                {
                    title:
                        "Daftar Produk",

                    currentPage:
                        "produk",

                    search,

                    kategori,

                    categories
                }
            );

        } catch (error) {

            console.error(
                "Products page error:",
                error
            );

            next(error);

        }

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
            // CARI PRODUK
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
            // DETAIL PRODUK
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