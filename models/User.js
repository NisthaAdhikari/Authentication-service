const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullName: String, // String is shorthand for {type: String}
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        token: {
            type: String,
        },
    },
    { timestamps: true } // Enable timestamps
);

//creates a Mongoose model named "User" based on the provided schema i.e. userSchema
const User = mongoose.model('User', userSchema,'users');
//export the User model for use in other files
module.exports = User;

