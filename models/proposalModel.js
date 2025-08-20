// models/proposalModel.js
const mongoose =require("mongoose")

// Items array from AddProposal.jsx
const proposalItemSchema = new mongoose.Schema(
  {
    product: { type: String,  },
    qty: { type: Number,  },
    price: { type: Number,  }
  },
  { _id: false }
);

const proposalSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    // relatedTo: { type: String, enum: ['lead', 'customer'], required: true },
    // leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },

    discount: { type: String, default: "no-discount" },
    visibility: { type: String, enaum: ['private', 'public'], default: "private" },
    status:  String ,

    startDate: { type: Date,  },
    dueDate: { type: Date, },

    tags: [String],
    assignees:[String],
    // assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


    relatedTo: { type: String},
    to:String,
    addressLine1: String,
    addressLine2: String,
    email: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    timezone: String,
    currency: String,

    // allowComments: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User",
        //  required: true  
        },

    // 👇 AddProposal.jsx item array
    items: [proposalItemSchema]
  },
  { timestamps: true }
);

const proposalModel = mongoose.model("Proposal", proposalSchema);

module.exports = proposalModel
