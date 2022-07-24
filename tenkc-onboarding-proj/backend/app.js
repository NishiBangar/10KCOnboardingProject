const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Mongo model -- Post model
// const Post = require('./models/post');

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

// Grand access to /images folder
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

/* // Handle POST request
app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = new Post({   // DB schema instance
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save().then(createdPost => {
    console.log(createdPost);
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });

});

app.get('/api/posts', (req, res, next) => {
  // res.send('Hello from Express!');
  //  const posts = [
  //   { id: 'fasdf123l',
  //     title: 'First server-side post',
  //     content: "This is coming from the server"
  //   },
  //   { id: 'asdfasdf1',
  //     title: 'Second server-side post',
  //     content: "This is coming from the server"
  //   }
  // ];

  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);
    });
  res.status(200).json({ message: 'Posts deleted successfully'});
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({   // DB schema instance
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Update successful"
      })
    });
});

app.get("/api/posts/:id", (req,res,next)=>{
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: "Post not found"});
    }
  })
}) */

// Router configuration to handle Posts reqs (/api/posts)
app.use("/api/posts", postsRoutes);
app.get('/', (req, res, next) => {
  res.status(200).json({message: 'Default route - 10K C!'});
})

module.exports = app;
