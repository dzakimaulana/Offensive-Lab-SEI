const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./src/config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Create a write stream for logging
//const logStream = fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a" });

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.urlencoded({ extended: true }));

// Middleware to log all requests
app.use((req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
    console.log(logMessage.trim());
    // logStream.write(logMessage);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ERROR: ${err.message} at ${req.originalUrl}\n`;
    console.error(errorLog.trim());
    // logStream.write(errorLog);
    res.status(500).send("Internal Server Error");
});


// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, "src", "public")));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
const mainRoutes = require("./src/routes/mainRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes); 

// Run migrations and seeds on startup
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

// Start Server After Database Setup
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
