const express = require("express");
const router = express.Router();

const products = require("../data/products");

// =====================
// BERANDA
// =====================
router.get("/", (req, res) => {
    res.render("home", {
        title: "Beranda",
        products: products.slice(0, 3)
    });
});

// =====================
// HALAMAN PRODUK
// =====================
router.get("/produk", (req, res) => {

    let filteredProducts = [...products];

    const { kategori, search } = req.query;

    if (kategori) {
        filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === kategori.toLowerCase()
        );
    }

    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.render("products", {
        title: "Daftar Produk",
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
        return res.status(404).render("notfound");
    }

    res.render("detail", {
        title: "Detail Produk",
        product
    });

});

// =====================
// TANYA AI
// =====================
router.get("/tanya-ai", (req, res) => {

    res.render("ai", {
        title: "Tanya AI"
    });

});

module.exports = router;