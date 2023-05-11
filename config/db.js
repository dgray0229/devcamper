const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;