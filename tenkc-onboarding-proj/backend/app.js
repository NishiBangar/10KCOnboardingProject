const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// API Routes
const postsRoutes = require("./routes/posts");

const app = express();

// Mongo connection
const MONGODB_URI = "mongodb+srv://nishi:nishi@cluster0.qv6hj3s.mongodb.net/tenkc?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo server");
  }).catch(() => {
    console.log("Connection failed");
  });

//Body Parser - to set body in POST req to req obj
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Grant access to /images folder
// Make /images folder Statically accessable -> req made to access files should be allowed
app.use("/images", express.static(path.join("backend/images")));

/* app.use((req, res, next) => {
  console.log('First middleware');
  next();
}); */

// Set Headers to allow domains to access server resources
app.use((req,res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  next();
});

app.get('/', (req, res, next) => {
  res.status(200).json({message: 'Default route - 10K C!'});
});

// Router configuration to handle Posts reqs (/api/posts)
app.use("/api/posts", postsRoutes);

module.exports = app;
