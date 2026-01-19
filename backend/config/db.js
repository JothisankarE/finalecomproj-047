const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/textilehub').then(() => console.log("MongoDB Connected Successfully!"))
}

module.exports = connectDB;





