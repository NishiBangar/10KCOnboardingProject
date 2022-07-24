const express = require('express');
const multer = require('multer');

const router = express.Router();

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

// Mongo model -- Post model
const Post = require('../models/post');


// Handle POST request to SAVE a  post
router.post("", multer({storage: storage}).single("image") , (req, res, next) => {
  // const post = req.body;
  const url = req.protocol + '://' + req.get("host"); // Get url of the server
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
      // post: {
      //   // 1st --> using spread operator, send a copy of post object
      //   // 2nd --> add id property with updated value
      //   ...createdPost,
      //   id: createdPost._id
      // }

      // postId: createdPost._id

    });
  });

});

router.get('', (req, res, next) => {
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

  console.log("--- Query Parameters ---");
  console.log(req.query);
  const postQuery = Post.find();
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

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
    });
  res.status(200).json({ message: 'Posts deleted successfully'});
});

// Update post based on Id
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  // console.log("--- Update: file from server: ");
  // console.log(req.file);
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
  console.log("-- Post data from FE");
  console.log(post);
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json({
        message: "Update successful!"
      })
    });
});

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

module.exports = router;
