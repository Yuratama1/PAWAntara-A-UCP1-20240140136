const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
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
    res.status(404).render("notfound");
});

// Running Server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});