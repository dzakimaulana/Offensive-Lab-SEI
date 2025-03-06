const express = require('express');
const db = require('../src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/', userRoutes);

// Run migrations and seeds on startup
const setupDatabase = async () => {
    try {
        console.log('Running migrations...');
        await db.migrate.latest();

        console.log('Running seeds...');
        await db.seed.run();

        console.log('Database setup complete.');
    } catch (error) {
        console.error('Database setup failed:', error);
    }
}

setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});