const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// ✅ Register Route
userRouter.post("/user/register", async (req, res) => {
  const { name, email, mobileNumber, address, dob, role, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new userModel({
      name,
      email,
      mobileNumber,
      address,
      dob,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
    console.log("✅ User registered successfully:", newUser);
  } catch (error) {
    console.error("❌ Error during signup:", error);
    res.status(500).send({ message: "Server error during signup" });
  }
});

// ✅ Login Route (by Email or Mobile)
userRouter.post("/user/login", async (req, res) => {
  const { emailOrMobile, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        res.status(200).send({
          message: "Login successful",
          token: jwt.sign({ _id: user._id, role: user.role }, "batman"),
          userId: user._id,
          name: user.name,
          email: user.email,
        });
      } else {
        res.status(400).send({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).send({ message: "Server error during login" });
  }
});

module.exports = userRouter;

