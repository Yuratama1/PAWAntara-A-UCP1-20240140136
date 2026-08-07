const express = require("express");

const app = express();

const PORT = 3000;

// View Engine
app.set("view engine", "ejs");

// Static Folder
app.use(express.static("public"));

// Home
app.get("/", (req, res) => {
    res.send("Server Running...");
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});