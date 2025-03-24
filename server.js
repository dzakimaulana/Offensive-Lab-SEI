const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./src/config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "src", "public")));

app.use((req, res, next) => {
    const startTime = new Date();
    
    res.on("finish", () => {
        const duration = new Date() - startTime;
        console.log(`[${startTime.toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });

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

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use((req, res) => {
    return res.status(404).render("error", { statusCode: 404, message: "Page Not Found" });
});

app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${err.message} at ${req.originalUrl}`);
    return res.status(err.status || 500).render("error", { statusCode: err.status || 500, message: err.message || "Internal Server Error" });
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
        process.exit(1);
    }
};

setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
