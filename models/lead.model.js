const mongoose = require("mongoose");

// History of disposition changes (audit trail)
const DispositionHistorySchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    by: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },
    at: { type: Date, default: Date.now },
    note: String,

    // 👇 Ye naya field add kiya
    attemptNo: { type: Number, default: 0 },  
  },
  { _id: false }
);

// Next action / reminder schema
const NextActionSchema = new mongoose.Schema(
  {
    date: Date,
    note: String,
    reminderSet: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
  },
  { _id: false }
);

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

    assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    groups: {
      type: String,
      enum: [
        "group-a",
        "group-b",
        "group-c",
        "group-d",
        "group-e",
        "group-f",
        "group-g",
        "group-h",
        "group-i",
        "group-j",
        "group-k",
        "",
      ],
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

    // 🔹 Current disposition
    disposition: {
      type: String,
      enum: [
        "Call back",
        "Follow-up",
        "Hot prospect",
        "Ringing no response",
        "Call disconnected",
        "Switch off",
        "Hang up",
        "Not reachable",
        "Wrong number",
        "Out station number",
        "Appointment",
        "App confirm",
        "App not confirm",
        "Met done",
        "Met not done",
        "After met follow-up",
        "Sales Closed",
        ""
      ],
      default: "",
    },

    // Counter of risky attempts
    dispositionAttempts: { type: Number, default: 0 },

    // Last updated by
    updatedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },
    updatedAt: Date,

    // Full history
    dispositionHistory: { type: [DispositionHistorySchema], default: [] },

    nextAction: NextActionSchema,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const leadModel = mongoose.model("Lead", leadSchema);
module.exports = leadModel;
