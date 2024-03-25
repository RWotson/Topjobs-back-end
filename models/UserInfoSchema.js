const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  nic: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
});

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);

module.exports = UserInfo;
