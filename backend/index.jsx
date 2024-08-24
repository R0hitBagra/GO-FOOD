const express = require('express');
const app = express();
const port = 5000;

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "go-food-git-master-rohits-projects-659dc18b.vercel.app"); // Adjust the port as necessary
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB and load data
const connectToMongoDB = require('./db.jsx');
let foodData = [], categoryData = [];

connectToMongoDB()
    .then(data => {
        foodData = data.foodData;
        categoryData = data.categoryData;
    })
    .catch(err => console.error("Database connection failed:", err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use the routes defined in Auth.jsx
app.use('/api/auth', require('./Routes/Auth.jsx'));

// Get food data
app.post('/api/auth/foodData', (req, res) => {
    res.json([foodData, categoryData]);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
