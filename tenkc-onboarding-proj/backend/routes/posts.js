const express = require('express');
const multer = require('multer');

const router = express.Router();

// Mongo model -- Post model
const Post = require('../models/post');

// Helper to map of Mime types and their extensions
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Configure Multer --> how to store things
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid){
      error = null;
    }
    callback(error, "backend/images") // path relative to the server.js file
   },
   filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extn = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extn);
   }
});


// Handle POST request to SAVE a post
router.post("", multer({storage: storage}).single("image") , (req, res, next) => {

  const url = req.protocol + '://' + req.get("host"); // Get url of the server
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });

  // Save details in MongoDB
  post.save().then(createdPost => {
    res.status(200).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });

});

// Handle GET request
router.get('', (req, res, next) => {

  const postQuery = Post.find();

  // Pagination --> Get details for the specific page according to the page size
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  let fetchedPosts;
  if(pageSize && currentPage) { // Pagination query
    // 1 --> skip previous page contents
        //( if pageSize = 10; page = 2
            //-> then skip 1st 10 data of 1st page and retrieve from 11th data)
    // 2 --> Limit data retrieval to pageSize (i.e. 10 data per page)
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // Query MongoDB to get posts
  postQuery.find().then(documents => {
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

// Handle GET request --> Get post by ID
router.get("/:id", (req,res,next)=>{
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }
    else {
      res.status(404).json({message: "Post not found"});
    }
  })
});

// Handle PUT requests --> Update post based on ID
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;  // if existing file (no new upload) -> Json obj
  if(req.file){ // if new file to updload -> FormData
    const url = req.protocol + '://' + req.get("host"); // Get url of the server
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  // Query MongoDB
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json({
        message: "Update successful!"
      })
    });
});

// Handle DELETE requests --> Detaile post based on ID
router.delete("/:id", (req, res, next) => {
  //Query MongoDB
  Post.deleteOne({_id: req.params.id})
    .then(result => {
    });
  res.status(200).json({ message: 'Posts deleted successfully'});
});






module.exports = router;
