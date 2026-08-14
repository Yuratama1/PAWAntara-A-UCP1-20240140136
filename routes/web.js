const express = require("express");

const router = express.Router();

const requireAuth =
    require("../middleware/auth");

const products =
    require("../data/products");


// ======================================================
// LOGIN
// ======================================================

router.get(
    "/login",
    (req, res) => {

        // Jika sudah login
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
    (req, res) => {

        return res.render(
            "home",
            {
                title: "Beranda",
                currentPage: "home",
                products:
                    products.slice(0, 3)
            }
        );

    }
);


// ======================================================
// HALAMAN PRODUK
// PUBLIC
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
    (req, res) => {

        const id =
            parseInt(
                req.params.id,
                10
            );


        const product =
            products.find(
                item =>
                    item.id === id
            );


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