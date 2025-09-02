const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  // designation: { type: String },
  website: { type: String },
  address: { type: String },
    groups: {
  type: String,

  
  enum: [
    "group-a", "group-b", "group-c", "group-d", "group-e", "group-f",
    "group-g", "group-h", "group-i", "group-j", "group-k",""
  ]},
   dob: {
    type: Date,
    required: false // 
  },
   country: String,
   state: String,
    citys: String,
  // description: { type: String },
  // dob: { type: Date },
  // country: { type: String },
  // state: { type: String },
  // city: { type: String },
  // timezone: { type: String },
  // languages: [{ type: String }],
  // currency: { type: String },
  // group: [{ type: String }],
  status: {
    type: String,
    // enum: ['active', 'inactive', 'declined'],
    // default: 'active'
  },
  
  // privacy: { type: String }
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
}, { timestamps: true });

const customerModel= mongoose.model("Customer", customerSchema);

module.exports = customerModel;
