const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const UserInfo = require("../models/UserInfoSchema");

// Create user data
router.post("/user/profile", authenticate, async (req, res) => {
  try {
    const {
      fullName,
      address,
      dob,
      nic,
      telephone,
      weight,
      height
    } = req.body;
    const userId = req.rootUser._id;
    const userInfo = await UserInfo.findOne({ userId });

    if (userInfo) {
      return res.status(409).json({
        status: 409,
        message: "User data already exists"
      });
    }

    const newUserInfo = new UserInfo({
      userId,
      fullName,
      address,
      dob,
      nic,
      telephone,
      weight,
      height
    });

    await newUserInfo.save();
    res.status(201).json({ status: 201, message: "Data added successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Update user data
router.put("/user/profile", authenticate, async (req, res) => {
  try {
    const {
      fullName,
      address,
      dob,
      nic,
      telephone,
      weight,
      height
    } = req.body;
    const userId = req.rootUser._id;
    const userInfo = await UserInfo.findOne({ userId });

    if (!userInfo) {
      return res.status(404).json({
        status: 404,
        message: "User info not found"
      });
    }

    userInfo.fullName = fullName;
    userInfo.address = address;
    userInfo.dob = dob;
    userInfo.nic = nic;
    userInfo.telephone = telephone;
    userInfo.weight = weight;
    userInfo.height = height;

    await userInfo.save();
    res.status(200).json({
      status: 200,
      message: "Data updated successfully",
      data: userInfo
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Get user data
router.get("/user/profile", authenticate, async (req, res) => {
  try {
    const userId = req.rootUser._id;
    const userInfo = await UserInfo.findOne({ userId });

    if (!userInfo) {
      return res.status(404).json({
        status: 404,
        message: "User info not found"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Data retrieved successfully",
      data: userInfo
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});


module.exports = router;
