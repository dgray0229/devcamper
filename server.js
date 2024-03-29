const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

// Load env vars
dotenv.config({path: "./config/config.env"});

// connect to database
connectDB();
const app = express();

// Body parser
app.use(express.json());

// Mount middleware
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// File uploading
app.use(fileupload(undefined));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.get('/', (req, res) => {
    res.send('Hello from express');
});
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
});