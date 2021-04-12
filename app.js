const express = require('express');

// Load env variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Connect to DB
const connectDB = require('./db');
connectDB();

// Initialize App
const app = express();

// Body parser
app.use(express.json());

// Routes
app.use('/api/user', require('./routes/user'));

const PORT = 3000;

app.listen(PORT, console.log(`Server is up and running on ${PORT}.`));
