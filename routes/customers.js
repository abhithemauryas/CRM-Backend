const express = require("express");
const customerModel = require("../models/customers.model");
const authenticateToken = require("../middleware/authMiddleware");
const mongoose = require("mongoose"); // Added for ObjectId check

const customerRouter = express.Router();

// ✅ Create Customer Route
customerRouter.post("/customer/create", authenticateToken, async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    website,
    address,
    status,
    groups,
    dob,
    country,
    state,
    citys
  } = req.body;

  try {
    const newCustomer = new customerModel({
      name,
      email,
      phone,
      company,
      website,
      address,
      status,
      groups,
      dob,
      country,
      state,
      citys,
      createdBy: req.user._id,
    });

    await newCustomer.save();

    res.status(201).send({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("❌ Error creating customer:", error);
    res.status(500).send({ message: "Server error during customer creation" });
  }
});


// ✅ Get Single Customer by ID
customerRouter.get("/customer/:id", async (req, res) => {
  const { id } = req.params;

  // 🚨 Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid customer ID" });
  }

  try {
    const customer = await customerModel.findById(id).lean();

    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send({ message: "Customer fetched successfully", customer });
  } catch (error) {
    console.error("❌ Error finding single customer:", error);
    res.status(500).send({ message: "Server error during customer fetch" });
  }
});


// ✅ Get All Customers
customerRouter.get("/find/customer", async (req, res) => {
  try {
    const customers = await customerModel.find()
    res.status(200).send({ message: "Customers fetched successfully", customers });
    console.error("Customers fetched successfully", customers);
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    res.status(500).send({ message: "Server error during fetching customers" });
  }
});


customerRouter.put("/customer/update/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    company,
    website,
    address,
    status,
    groups,
    dob,
    country,
    state,
    citys
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid customer ID" });
  }

  try {
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        company,
        website,
        address,
        status,
        groups,
        dob,
        country,
        state,
        citys
      },
      { new: true }
    ).lean();

    if (!updatedCustomer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    res.status(500).send({ message: "Server error during customer update" });
  }
});

// ✅ Delete Customer by ID
customerRouter.delete("/customer/delete/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid customer ID" });
  }
  try {
    const deletedCustomer = await customerModel.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).send({ message: "Customer not found" });
    }
     const msg = "Customer deleted successfully";
    res.status(200).send({ message: msg });
    console.log(msg);
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
    res.status(500).send({ message: "Server error during customer deletion" });
  }
});


// ❌ Typo: "cutomer" => ✅ "customer"
customerRouter.patch("/customer/status/:id",authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid customer ID" });
  }

  try {
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updatedCustomer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send({
      message: "Customer status updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("❌ Error updating customer status:", error);
    res.status(500).send({ message: "Server error during customer status update" });
  }
});

customerRouter.put('/customer/:id',authenticateToken, async (req, res) => {
  try {
    const customer = await customerModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).send({ error: 'Update failed' });
  }
});

module.exports = customerRouter;

