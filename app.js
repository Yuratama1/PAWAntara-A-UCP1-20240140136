const express = require("express");
const path = require("path");

const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");

app.use("/", webRoutes);
app.use("/api", apiRoutes);

// 404
app.use((req, res) => {
    res.status(404).render("notfound", {
        title: "Halaman Tidak Ditemukan",
        currentPage: ""
    });
});

// Running Server
app.listen(PORT, () => {
    console.log(`SERVER Server berjalan di http://localhost:${PORT}`);
});