const express = require('express');
const router = express.Router();
const jwt  = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const UserModel = mongoose.model("UserModel");
const PostModel = mongoose.model('PostModel');
const {MONGO_URL, JWT_SECRET} = require('../config');
const protectedRoute = require('../middleware/protectedResource');




// Signup route

router.post("/signup", (req, res) => {
  const { name, username, email, password, profileImg , location, dob} = req.body;

  if (!name || !password || !email || !username || !location ||!dob) {
    return res.status(400).json({ error: "One or more mandatory fields are empty" });
  }

  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(500).json({ error: "User with this email already registered" });
      }

      bcryptjs.hash(password, 16)
        .then((hashedPassword) => {
          const user = new UserModel({ name, email, password: hashedPassword, username, profileImg,location,dob});
          user.save()
            .then((newUser) => {
              res.status(201).json({ result: "User Signed Up Successfully!" });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: "Error saving user to the database" });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Error hashing the password" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error finding user in the database" });
    });
});






// Login route

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password ) {
    return res.status(400).json({ error: "One or more mandatory fields are empty" });
  }

  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      bcryptjs.compare(password,userInDB.password)
        .then((didMatch) => {
          if(didMatch){
            const jwtToken = jwt.sign({_id:userInDB._id}, JWT_SECRET);
            const userInfo = {"_id":userInDB._id,"email": userInDB.email, "name":userInDB.name , "profileImg":userInDB.profileImg, "userdsp":userInDB.
            description , "username":userInDB.username }
            res.status(200).json({ result:{token: jwtToken, user:userInfo} });
          }else{
            res.status(401).json({ result: "Invalid Credentials" });

          }
        })
        .catch((err) => {
          console.log(err);
          
        });
    })
    .catch((err) => {
      console.log(err);

    });
});



// get user information by her id

router.get("/getme/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id).select("-password")
    .populate('following', 'name email profileImg')  // Populate the 'following' field
    .populate('followers', 'name email profileImg');
    const posts = await PostModel.find({ author: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user, posts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1 // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("File type allowed are .jpeg, .png, .jpg"), false);
    }
  }
});

// Update the profile editing route
router.put("/user/:id", upload.single('profileImg'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, profileImg  } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, { name, username, profileImg}, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Follow a user

router.post('/follow', protectedRoute, async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const user = await UserModel.findById(req.user._id);
    const userToFollow = await UserModel.findById(userIdToFollow);

    if (!user || !userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.following.includes(userIdToFollow)) {
      user.following.push(userIdToFollow);
      userToFollow.followers.push(req.user._id);
    }

    await user.save();
    await userToFollow.save();

    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unfollow a user
router.post('/unfollow', protectedRoute, async (req, res) => {
  try {
    const { userIdToUnfollow } = req.body;
    const user = await UserModel.findById(req.user._id);
    const userToUnfollow = await UserModel.findById(userIdToUnfollow);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.following.pull(userIdToUnfollow);
    userToUnfollow.followers.pull(req.user._id);

    await user.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/following/:userId', protectedRoute, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate('following', 'name username profileImg');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ following: user.following });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get followers list
router.get('/followers/:userId', protectedRoute, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate('followers', 'name username profileImg');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;




// module.exports = router;
