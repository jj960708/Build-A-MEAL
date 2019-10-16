const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    rquired: true
  },
  email: {
    type: String,
    rquired: true
  },
  password: {
    type: String,
    required: true
  }
  
});

module.exports = User = mongoose.model("User", UserSchema);
