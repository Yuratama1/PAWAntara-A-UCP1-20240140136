const express = require("express");
const path = require("path");
const session = require("express-session");
const rateLimit = require("express-rate-limit");

const {
    connectToDatabase
} = require("./config/db");

const logger =
    require("./middleware/logger");

const app = express();

const PORT = 3000;


// ======================================================
// DATABASE
// ======================================================

connectToDatabase();


// ======================================================
// VIEW ENGINE
// ======================================================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);


// ======================================================
// LOGGER
// ======================================================

app.use(logger);


// ======================================================
// BODY PARSER
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);


// ======================================================
// SESSION
// ======================================================

if (!process.env.SESSION_SECRET) {

    throw new Error(
        "SESSION_SECRET belum dikonfigurasi di file .env"
    );

}

app.use(
    session({

        secret:
            process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            sameSite: "lax",

            // false untuk localhost / HTTP
            // true jika production menggunakan HTTPS
            secure:
                process.env.NODE_ENV === "production",

            // 1 jam
            maxAge:
                1000 * 60 * 60

        }

    })
);


// ======================================================
// STATIC FOLDER
// ======================================================

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// ======================================================
// LOGIN RATE LIMITER
// ======================================================

const loginLimiter =
    rateLimit({

        // Batas waktu 15 menit
        windowMs:
            15 * 60 * 1000,

        // Maksimal 5 request login
        max: 5,

        // Kirim informasi rate limit
        // melalui header standar
        standardHeaders: true,

        // Tidak menggunakan header lama
        legacyHeaders: false,

        // Response ketika limit tercapai
        message: {
            status: "error",
            message:
                "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit."
        }

    });


// ======================================================
// ROUTES
// ======================================================

const webRoutes =
    require("./routes/web");

const apiRoutes =
    require("./routes/api");


// Rate limit khusus endpoint login
app.use(
    "/api/login",
    loginLimiter
);


app.use(
    "/",
    webRoutes
);

app.use(
    "/api",
    apiRoutes
);


// ======================================================
// INVALID JSON HANDLER
// ======================================================

app.use(
    (error, req, res, next) => {

        if (
            error instanceof SyntaxError &&
            error.status === 400 &&
            error.type === "entity.parse.failed"
        ) {

            console.error(
                "Invalid JSON request:",
                error.message
            );


            // ======================
            // API
            // ======================

            if (
                req.originalUrl.startsWith(
                    "/api/"
                )
            ) {

                return res.status(400).json({
                    status: "error",
                    message:
                        "Format JSON tidak valid"
                });

            }


            // ======================
            // WEB
            // ======================

            return res.status(400).send(
                "Format data tidak valid."
            );

        }

        next(error);

    }
);


// ======================================================
// 404 HANDLER
// ======================================================

app.use(
    (req, res) => {

        // ======================
        // API
        // ======================

        if (
            req.originalUrl.startsWith(
                "/api/"
            )
        ) {

            return res.status(404).json({
                status: "error",
                message:
                    "Endpoint tidak ditemukan"
            });

        }


        // ======================
        // WEB
        // ======================

        return res.status(404).render(
            "notfound",
            {
                title:
                    "Halaman Tidak Ditemukan",

                currentPage:
                    ""
            }
        );

    }
);


// ======================================================
// GENERAL ERROR HANDLER
// ======================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Server error:",
            error
        );


        // ======================
        // API
        // ======================

        if (
            req.originalUrl.startsWith(
                "/api/"
            )
        ) {

            return res.status(500).json({
                status: "error",
                message:
                    "Terjadi kesalahan pada server"
            });

        }


        // ======================
        // WEB
        // ======================

        return res.status(500).send(
            "Terjadi kesalahan pada server."
        );

    }
);


// ======================================================
// RUNNING SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `SERVER Server berjalan di http://localhost:${PORT}`
        );

    }
);