const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/produk", (req, res) => {
    res.render("products");
});

router.get("/tanya-ai", (req, res) => {
    res.render("ai");
});

module.exports = router;