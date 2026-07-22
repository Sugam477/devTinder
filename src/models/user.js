const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {     
                throw new Error("Gender must be either male, female, or other");
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "This is a default about me description."
    },
    skills: {
        type: [String]
    },
},
{
    timestamps : true
});



module.exports = mongoose.model('User', userSchema);