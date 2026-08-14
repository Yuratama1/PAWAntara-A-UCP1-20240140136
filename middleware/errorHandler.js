function errorHandler(err, req, res, next) {

    console.error("API Error:", err);

    // ==========================
    // INVALID JSON
    // ==========================
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        err.type === "entity.parse.failed"
    ) {
        return res.status(400).json({
            status: "error",
            message: "Format JSON tidak valid"
        });
    }

    // ==========================
    // DEFAULT ERROR
    // ==========================
    return res.status(err.status || 500).json({
        status: "error",
        message:
            err.status && err.status < 500
                ? err.message
                : "Terjadi kesalahan pada server"
    });
}

module.exports = errorHandler;