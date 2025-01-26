const mongoose = require('mongoose');

// Define schema
const myfriendsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  qualification: { type: String, required: true },
  gender: { type: String, required: true },
  mobile_num: { type: Number, required: true },
}, { collection: 'myfriends' }); // Specifies collection name

// Create model
const Friend = mongoose.model('Friend',myfriendsSchema);

module.exports = Friend;
