const mongoose = require("mongoose");
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
  mobileNumber: {
    type: String,
    required: false 
  },
  address: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: false // 
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "employee", "salesman"], 
    default: "employee"
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

