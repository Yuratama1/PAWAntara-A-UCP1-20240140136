const express = require("express");
const router = express.Router();

const products = require("../data/products");

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