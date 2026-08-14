function requireAuth(req, res, next) {

    if (req.session && req.session.admin) {
        return next();
    }

    // Jika request berasal dari API
    if (req.originalUrl.startsWith("/api/")) {

        return res.status(401).json({
            status: "error",
            message: "Anda harus login terlebih dahulu"
        });

    }

    // Jika membuka halaman biasa
    return res.redirect("/login");
}

module.exports = requireAuth;