function requireAuth(req, res, next) {

    // ==========================
    // CEK SESSION ADMIN
    // ==========================
    if (
        req.session &&
        req.session.admin &&
        req.session.admin.id
    ) {
        return next();
    }

    // ==========================
    // REQUEST API
    // ==========================
    if (req.originalUrl.startsWith("/api/")) {

        return res.status(401).json({
            status: "error",
            message: "Anda harus login terlebih dahulu"
        });

    }

    // ==========================
    // REQUEST HALAMAN WEB
    // ==========================
    return res.redirect("/login");
}

module.exports = requireAuth;