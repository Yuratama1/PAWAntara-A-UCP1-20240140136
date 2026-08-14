const express = require("express");
const path = require("path");
const session = require("express-session");

const { connectToDatabase } = require("./config/db");
const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;

connectToDatabase();

// ======================
// VIEW ENGINE
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// MIDDLEWARE
// ======================
app.use(logger);

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// ======================
// SESSION
// ======================
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// ======================
// STATIC FOLDER
// ======================
app.use(express.static(
    path.join(__dirname, "public")
));

// ======================
// ROUTES
// ======================
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

app.use("/", webRoutes);
app.use("/api", apiRoutes);

// ======================
// INVALID JSON HANDLER
// ======================
// Menangani JSON request yang formatnya rusak,
// contoh:
// {
//   "name": "Beras",
//   "price": abc
// }
app.use((error, req, res, next) => {

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        error.type === "entity.parse.failed"
    ) {

        console.error(
            "Invalid JSON request:",
            error.message
        );

        // Jika request berasal dari API
        if (req.originalUrl.startsWith("/api/")) {

            return res.status(400).json({
                status: "error",
                message: "Format JSON tidak valid"
            });

        }

        return res.status(400).send(
            "Format data tidak valid."
        );
    }

    next(error);
});

// ======================
// 404
// ======================
app.use((req, res) => {

    // Untuk API, gunakan JSON
    if (req.originalUrl.startsWith("/api/")) {

        return res.status(404).json({
            status: "error",
            message: "Endpoint tidak ditemukan"
        });
    }

    // Untuk halaman web
    return res.status(404).render("notfound", {
        title: "Halaman Tidak Ditemukan",
        currentPage: ""
    });
});

// ======================
// GENERAL ERROR HANDLER
// ======================
app.use((error, req, res, next) => {

    console.error(
        "Server error:",
        error
    );

    // API response
    if (req.originalUrl.startsWith("/api/")) {

        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server"
        });
    }

    // Web response
    return res.status(500).send(
        "Terjadi kesalahan pada server."
    );
});

// ======================
// RUNNING SERVER
// ======================
app.listen(PORT, () => {

    console.log(
        `SERVER Server berjalan di http://localhost:${PORT}`
    );

});