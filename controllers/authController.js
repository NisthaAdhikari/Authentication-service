const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

async function registerUser(req, res){
    try{
        const {email, password, fullName} = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName
        });

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ message: 'User registered successfully' });
    }
    catch(error){
        console.error('Error registering user', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}


async function loginUser(req, res){
    console.log(req.body);
    const {email, password} = req.body;

    const user = await User.findOne({email});
    console.log(user);

    if(!user){
        res.status(404).json({message: 'User does not exist'});
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        res.status(500).json({message: 'Invalid credentials.'});
    }

     // Create and sign the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    // Send the token in the response
    res.json({ user: user.email, token: token });

}


module.exports = {registerUser, loginUser};