const express = require("express");
const router = express.Router();
const JobAppointment = require("../models/JobAppoinmentSchema");
const authenticate = require("../middleware/authenticate");
const Payment = require("../models/paymentSchema");
const processPayment = require("../routes/paymentProcess");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a job appointment
router.post("/job-appointments", async (req, res) => {
  try {
    const { userId, date, location, description } = req.body;
    const jobAppointment = new JobAppointment({
      userId,
      date,
      location,
      description
    });
    await jobAppointment.save();
    res.status(201).json({ status: 201, message: "Job appointment created successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});




// Process payment

router.post("/payment", async (req, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        payment_method: paymentMethod,
        confirm: true
      });
      res.status(200).json({ sessionId: paymentIntent.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });
  
// router.post("/payment", async (req, res) => {
//     try {
//       const { amount, payment_method_id } = req.body;
//       const paymentIntent = await processPayment(amount, payment_method_id);
//       // Save payment details
//       const newPayment = new Payment({
//         userId: "6600078e8355e97c5493d967", // userId: req.rootUser._id,
//         paymentMethod: "Stripe", 
//         amount: amount,
//         paymentDate: new Date()
//       });
//       await newPayment.save();
//       res.status(200).json({ status: 200, message: "Payment processed successfully", paymentIntent });
//     } catch (error) {
//       res.status(400).json({ status: 400, message: error.message });
//     }
// });



// Update a job appointment
router.put("/job-appointments/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, location, description } = req.body;
    const jobAppointment = await JobAppointment.findByIdAndUpdate(id, {
      date,
      location,
      description
    }, { new: true });
    if (!jobAppointment) {
      return res.status(404).json({ status: 404, message: "Job appointment not found" });
    }
    res.status(200).json({ status: 200, message: "Job appointment updated successfully", data: jobAppointment });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Delete a job appointment
router.delete("/job-appointments/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const jobAppointment = await JobAppointment.findByIdAndDelete(id);
    if (!jobAppointment) {
      return res.status(404).json({ status: 404, message: "Job appointment not found" });
    }
    res.status(200).json({ status: 200, message: "Job appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Get all job appointments
router.get("/job-appointments", authenticate, async (req, res) => {
  try {
    const jobAppointments = await JobAppointment.find();
    res.status(200).json({ status: 200, data: jobAppointments });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

// Get job appointments by user ID
router.get("/job-appointments/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const jobAppointments = await JobAppointment.find({ userId });
    res.status(200).json({ status: 200, data: jobAppointments });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

module.exports = router;
