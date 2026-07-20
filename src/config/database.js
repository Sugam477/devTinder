const mongoose = require('mongoose');

const connectDB = async () => {
   await mongoose.connect(
    "mongodb+srv://namastenode:NamasteNode12345@namastenode.onulb5p.mongodb.net/devTinder?retryWrites=true&w=majority"
);
}

module.exports = connectDB;





