const mongoose =  require('mongoose');
require('dotenv').config();

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to the database")
    }catch(err){
        console.log("Error while connecting to the databse...", err.message)
    }
}

module.exports = connectDB