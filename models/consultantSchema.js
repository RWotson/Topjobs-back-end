// consultantSchema
// consultantSchema.js
const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    firstName: String,
    lastName: String,
    designation: String,
    education: String,
    address: String,
    dob: Date,
    nic: String,
    telephoneNumber: String,
    available: Boolean,
    nationality: String,
    consultantType: String,
    availableTime: [String],
    description: String,
    photo: String, // Store image URL
    cv: String // Store CV URL
});

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;
