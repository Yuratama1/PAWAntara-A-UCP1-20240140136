const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth");

const products = require("../data/products");

// =====================
// LOGIN
// =====================
router.get("/login", (req, res) => {

    if (req.session && req.session.admin) {
        return res.redirect("/dashboard");
    }

    res.render("login", {
        title: "Login",
        currentPage: "login"
    });
});

// =====================
// DASHBOARD
// =====================
router.get(
    "/dashboard",
    requireAuth,
    (req, res) => {

        res.render("dashboard", {
            title: "Dashboard",
            currentPage: "dashboard",
            admin: req.session.admin
        });

    }
);

// =====================
// BERANDA
// =====================
router.get("/", (req, res) => {

    res.render("home", {
        title: "Beranda",
        currentPage: "home",
        products: products.slice(0, 3)
    });

});

// =====================
// HALAMAN PRODUK
// =====================
router.get("/produk", (req, res) => {

    let filteredProducts = [...products];

    const { kategori, search } = req.query;

    // Filter berdasarkan kategori
    if (kategori) {

        filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === kategori.toLowerCase()
        );

    }

    // Filter berdasarkan nama produk
    if (search) {

        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );

    }

    res.render("products", {
        title: "Daftar Produk",
        currentPage: "produk",
        products: filteredProducts,
        kategori,
        search
    });

});

// =====================
// DETAIL PRODUK
// =====================
router.get("/produk/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find(item => item.id === id);

    if (!product) {

        return res.status(404).render("notfound", {
            title: "Produk Tidak Ditemukan",
            currentPage: "produk"
        });

    }

    res.render("detail", {
        title: product.name,
        currentPage: "produk",
        product
    });

});

// =====================
// TANYA AI
// =====================
router.get("/tanya-ai", (req, res) => {

    res.render("ai", {
        title: "Tanya AI",
        currentPage: "ai"
    });

});

module.exports = router;