// models/proposalModel.js
const mongoose = require("mongoose")

// Items array from AddProposal.jsx
const proposalItemSchema = new mongoose.Schema(
  {
    product: { type: String, },
    qty: { type: Number, },
    price: { type: Number, }
  },
  { _id: false }
);

const proposalSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",   // 👈 Tumhare Lead model ka naam
      required: true
    },
    discount: { type: String, default: "no-discount" },
    visibility: {
      type: String,
      enum: ['public', 'private', 'personal', 'customs'], // add customs
      default: 'private'
    },
    status: String,
    startDate: { type: Date },
    dueDate: { type: Date },
    tags: [String],
    // 👇 User reference for multiple assignees
    assignees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedTo: { type: String },
    to: String,
    addressLine1: String,
    addressLine2: String,
    email: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    timezone: String,
    currency: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    items: [proposalItemSchema]
  },
  { timestamps: true }
);


const proposalModel = mongoose.model("Proposal", proposalSchema);

module.exports = proposalModel
