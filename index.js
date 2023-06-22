require('dotenv').config();
const express = require("express");
const app = express();

const connectToDatabase = require('./db');

const bodyParser = require('body-parser');
// Middleware to parse the request body
app.use(bodyParser.json());


// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

const port = 3000;


const authRouter = require('./routes/auth.js');
const authMiddleware = require('./middlewares/authMiddleware');


// app.use('/auth/', authMiddleware.authenticate, authRouter);

app.use('/auth/', authRouter);

async function startApp() {
  try {
    await connectToDatabase();
    // Start your server or perform other operations here
  } catch (error) {
    console.error('Error starting the application', error);
  }
}

startApp();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
