// JobAppoinmentSchema

const mongoose = require("mongoose");

const JobAppoinmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the userSchema
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const JobAppointment = mongoose.model("JobAppointment", JobAppoinmentSchema);

module.exports = JobAppointment;
