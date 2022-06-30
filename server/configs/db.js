const mongoose = require('mongoose');
require('dotenv').config()

module.exports = async() => {
    try {
        await mongoose.connect(process.env.DB, {
            autoIndex: true,
            serverSelectionTimeoutMS: 30000 // default 30 seconds
        });
        console.log("MongoDB connected~");
    } catch (err) {
        console.log("Mongoose: ", err);
    }
}