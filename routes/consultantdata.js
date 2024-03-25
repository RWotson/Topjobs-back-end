const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const Consultant = require("../models/consultantSchema");


// Multer configuration for handling file uploads
const upload = multer({
  dest: "../uploads" // directory where files will be stored
});

// Create consultant details
router.post("/consultants", authenticate, upload.single("cv"), upload.single("photo"), async (req, res) => {
  try {
    // Parse request body and handle file uploads
    const { firstName, lastName, designation, education, address, dob, nic, telephoneNumber, available, nationality, consultantType, availableTime, description } = req.body;
    const { filename: cv, filename: photo } = req.file;

    const newConsultant = new Consultant({
      userId: req.rootUser._id,
      firstName,
      lastName,
      designation,
      education,
      address,
      dob,
      nic,
      telephoneNumber,
      available,
      nationality,
      consultantType,
      availableTime,
      description,
      photo,
      cv
    });

    await newConsultant.save();
    res.status(201).json({ status: 201, message: "Consultant details created successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Read all consultants
router.get("/consultants", async (req, res) => {
  try {
    const consultants = await Consultant.find();
    res.status(200).json({ status: 200, data: consultants });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Read consultant details by user ID
router.get("/consultants/:userId", async (req, res) => {
  try {
    const consultant = await Consultant.findOne({ userId: req.params.userId });
    if (!consultant) {
      return res.status(404).json({ status: 404, message: "Consultant details not found" });
    }
    res.status(200).json({ status: 200, data: consultant });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Update consultant details
router.put("/consultants/:userId", authenticate, upload.single("cv"), upload.single("photo"), async (req, res) => {
  try {
    // Parse request body and handle file uploads
    const { firstName, lastName, designation, education, address, dob, nic, telephoneNumber, available, nationality, consultantType, availableTime, description } = req.body;
    const { filename: cv, filename: photo } = req.file;

    const updatedConsultant = {
      firstName,
      lastName,
      designation,
      education,
      address,
      dob,
      nic,
      telephoneNumber,
      available,
      nationality,
      consultantType,
      availableTime,
      description,
      photo,
      cv
    };

    await Consultant.findOneAndUpdate({ userId: req.params.userId }, updatedConsultant);
    res.status(200).json({ status: 200, message: "Consultant details updated successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Delete consultant details
router.delete("/consultants/:userId", authenticate, async (req, res) => {
  try {
    await Consultant.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json({ status: 200, message: "Consultant details deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

module.exports = router;
