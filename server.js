const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
// Route files
const bootcamps = require("./routes/bootcamps");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();
const app = express();

// Mount middleware
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}


// Mount routers
app.get('/', (req, res) => {
	res.send('Hello from express');
});
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 8000;
app.listen(
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