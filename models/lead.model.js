const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      // enum:["new", "connect","working", "qualified","declined","customer"]
    },
    source: {
      type: String,
      // enum:["facebook","twitter","instagream","linkedin", "searchEngine","others"]
    },
    visibility: {
      type: String,
      // enum:["public","private","personal","customs"]
    },
    tags: {
      type: [String], // supports multiple tags
      enum: [
        "vip",
        "bugs",
        "team",
        "updates",
        "personal",
        "promotions",
        "high-budget",
        "customs",
        "low-budget",
        "wholesale",
        "primary",
      ],
    },
    
    assigned: {
  type: [String],
},
  groups: {
  type: String,
  enum: [
    "group-a", "group-b", "group-c", "group-d", "group-e", "group-f",
    "group-g", "group-h", "group-i", "group-j", "group-k",""
  ]
},
    name: String,
    email: String,
    phone: String,
    company: String,
    website: String,
    address: String,
    description: String,
    country: String,
    state: String,
    citys: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // if you want to link to User model
    },
  },
  { timestamps: true }
);

const leadModel =mongoose.model("Lead", leadSchema);

module.exports = leadModel


