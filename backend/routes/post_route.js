
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostModel = mongoose.model('PostModel');
const protectedRoute = require('../middleware/protectedResource');



// GET all users posts  

router.get('/allposts',(req, res)=> {
  PostModel.find()
  .populate("author","_id name username profileImg")
  .populate('originalAuthor', 'name profileImg')
  .sort({ createdAt: -1 })
  .then((dbPosts)=>{
    res.status(200).json({post:dbPosts})
  })
  
  .catch((error) => {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  });
  
})



// get posts by user Id

router.get('/myallposts/:id', (req, res) => {
  const userId = req.params.id;
  PostModel.find({ author: userId }) 
    .populate("author", "_id name username profileImg")
    .then((dbPosts) => {
      res.status(200).json({ posts: dbPosts });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to retrieve posts" });
    });
});





// create post 

router.post('/createpost',protectedRoute,(req, res) => {
  const {description, location, image} = req.body;
  if(!description || !location ){
    return res.status(400).json({ error: "One or more mandatory fields are empty" });

  }
  const postObj = new PostModel({description, location, image, author:req.user});
  postObj.save()
  .then((newPost)=> {
    res.status(201).json({post:newPost});
  })
  .catch((error) => {
    console.error(error);
  })
});




// create retweets
router.post('/retweet', protectedRoute, (req, res) => {
  PostModel.findById(req.body.postId)
    .populate('author', 'name profileImg')
    .then((originalPost) => {
      if (!originalPost) {
        return res.status(400).json({ error: "Original post does not exist" });
      }
      const retweetObj = new PostModel({
        description: originalPost.description,
        location: originalPost.location,
        image: originalPost.image,
        author: req.user._id, 
        originalPost: originalPost._id,
        originalAuthor: originalPost.author._id
      });
      retweetObj.save()
        .then((newRetweet) => {
          originalPost.retweets += 1; 
          originalPost.save() 
            .then((updatedOriginalPost) => {
              res.status(201).json({ post: newRetweet, retweetcount: updatedOriginalPost.retweets });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({ error: "Error updating original post retweet count" });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: "Error creating retweet" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error finding original post" });
    });
});


// get post information by post id

router.get('/post/:postId', async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate('author', 'name profileImg')
      .populate('comments.commentedBy', 'name username profileImg');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// delete posts logdin user can delete her posts

router.delete('/deletepost/:postId',protectedRoute,(req, res)=> {
  PostModel.findOne({ _id: req.params.postId })
  
  .populate("author","_id")
  .then(( postFound)=> {
    if(!postFound ) {
      console.log(`Post with ID: ${postId} does not exist`); 
      return res.status(400).json({error:"post does not exist"})
    }

    // check if the post author is same as loggdin user  only then allow to delete the post

    if(postFound.author._id.toString() === req.user._id.toString()) {
      postFound.deleteOne()
      .then((data)=> {
        res.status(200).json({result:data});
      })
      .catch((error)=> {
        console.log(error);
      });
    }
    else {
      res.status(403).json({ error: "Unauthorized action" });
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ error: "Error finding the post" });
  });

})




// like post
router.post('/like', protectedRoute, (req, res) => {
  const { postId } = req.body;

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(400).json({ error: "Post not found" });
      }

      // Check if the user has already liked the post
      const userId = req.user._id;
      const liked = post.likes.includes(userId);

      if (liked) {
        // Unlike the post
        post.likes.pull(userId);
      } else {
        // Like the post
        post.likes.push(userId);
      }

      post.save()
        .then((updatedPost) => res.status(200).json({ post: updatedPost }))
        .catch((error) => res.status(500).json({ error: "Error updating post" }));
    })
    .catch((error) => res.status(500).json({ error: "Error finding post" }));
});


// comment

router.post('/comment', protectedRoute, async (req, res) => {
  try {
    const { postId, commentText } = req.body;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send('Post not found');

    const newComment = {
      commentText,
      commentedBy: req.user._id,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



module.exports = router;