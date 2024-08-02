


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    default: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  coverImg: {
    type: String,
    default: 'https://t4.ftcdn.net/jpg/02/17/89/41/360_F_217894165_H4jRalQ4eg9Kp8XUVGEa7XFDEPtTQ9PY.jpg'
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'
  }],
  location:{
    type:String,
  },
  dob: {
     type: Date 
    }
});

mongoose.model("UserModel", userSchema);
