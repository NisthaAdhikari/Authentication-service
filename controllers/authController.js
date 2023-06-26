const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerUserSchema, loginUserSchema } = require('../validationSchemas');
const {encryptToken, decryptToken} = require('../encryption.js');

require('dotenv').config();

async function registerUser(req, res){
    try{
        const { error, value } = registerUserSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ message: 'Validation error', error: error.details });
        }

        const {email, password, fullName} = value;
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
    const{error, value} = loginUserSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'Validation error', error: error.details });
    }
    const {email, password} = value;

    const user = await User.findOne({email});
    console.log(user);

    if(!user){
        return res.status(404).json({message: 'User does not exist'});
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        return res.status(500).json({message: 'Invalid credentials.'});
    }

     // Create and sign the JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    user.token = encryptToken(token, process.env.SECRET_KEY);
    
    await user.save();
    console.log(user.token);

    // Send the token in the response
    return res.json({ user: user.email, token: token });

}

async function logoutUser(req, res) {
  const { token } = req.body;

  try {
    // Retrieve the user from the database
    const user = await User.findById(req.user.id);

    // Decrypt the stored encrypted token
    const decryptedToken = decryptToken(user.encryptedToken, process.env.SECRET_KEY);

    if (decryptedToken === token) {
      // Tokens match, logout the user
      user.encryptedToken = ''; // Clear the encrypted token
      await user.save();
      return res.status(200).json({ message: 'User logged out successfully' });
    } else {
      // Tokens do not match
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error logging out user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {registerUser, loginUser, logoutUser};