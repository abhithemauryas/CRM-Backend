const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisko notification milega
    type: { type: String, required: true }, // e.g., 'lead-assigned', 'disposition-changed'
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // related lead
    title: { type: String, required: true }, // short title
    description: { type: String }, // detailed message
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
