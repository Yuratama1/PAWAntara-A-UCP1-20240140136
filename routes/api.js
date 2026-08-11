const express = require("express");
const router = express.Router();

const products = require("../data/products");

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