const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./src/config/database");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "src", "public")));

app.use((req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
    console.log(logMessage);
    next();
});
    
const mainRoutes = require("./src/routes/mainRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
    const error = new Error("Method Not Allowed");
    error.status = 405;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${err.message} at ${req.originalUrl}`);
    return res.status(err.status || 500).render("error", { 
        message: err.message || "Internal Server Error",
    });
});

const setupDatabase = async () => {
    try {
        console.log("📌 Running migrations...");
        await db.migrate.latest();

        console.log("📌 Running seeds...");
        await db.seed.run();

        console.log("✅ Database setup complete.");
    } catch (error) {
        console.error("❌ Database setup failed:", error);
    }
};

setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
