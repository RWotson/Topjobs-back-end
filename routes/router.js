const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const { sendEmail } = require("../utils/Mailer");
const { validate } = require("../models/UserInfoSchema");
const crypto = require('crypto');


// for user registration

router.post("/register", async (req, res) => {
  const { fname, email, password, cpassword,role } = req.body;

  if (!fname || !email || !password || !cpassword) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const preuser = await userdb.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "Password and Confirm Password Not Match" });
    } else {
      const finalUser = new userdb({
        fname,
        email,
        password,
        cpassword,
        role
      });

      // here password hasing

      const storeData = await finalUser.save();

      // mail to user register successfully

      const emailHtml = `
      <!DOCTYPE html>
      <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      background: #f9f9f9;
    }
    .header {
      background-color: rgb(0, 128, 202); /* Changed to light blue */
      color: white;
      padding: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      text-align: center;
      font-size: 24px;
    }
    .footer {
      background-color: rgb(0, 128, 202);; /* Changed to light blue */
      color: white;
      padding: 20px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: left;
      font-size: 14px;
    }
    .content {
      padding: 20px;
      font-size: 18px;
    }

    .button{
        padding:10px;
        background-color: rgb(10, 202, 0);
        color: white;
        border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="header">Thank you for registering with TopJobs Consultant lanka Ltd.!</div> <!-- Updated company name -->
  <div class="content">
    <p>Hello <strong>${req.body.fname}</strong>,</p>

    <section id="services">
    <h2>Empowering Your Job Search</h2>
    <p>We offer expert job consulting services to help you land your dream job.</p>
    <ul class="services">
      <li>Resume & Cover Letter Writing</li>
      <li>Interview Coaching & Mock Interviews</li>
      <li>Career Path Planning & Guidance</li>
    </ul>
    <a class="button">Schedule Now</a>
  </section>

   
    <p>Thank you for your interest in TopJobs Consultant lanka </p>
  </div>
  <div class="footer">
    <p>TopJob is a leading provider of Consultant services in Colombo Srilanka. We offer a wide range of opportunities for passionate and talented individuals like yourself.</p>
    <p>General Line : +94 (0) 115577111</p>
    <p>Fax : +94 (0) 11 2430393</p>
    <p>Email : TopJob@slt.lk</p>
    <p>TopJobs Consultant lanka Ltd</p>
    <p>23, Deshamanya H. K Dharmadasa Mawatha, Colombo 2, Sri Lanka.</p>
  </div>
</body>
</html>

  `;

      // Use the sendEmail function with the dynamically generated HTML
      const emailSent = await sendEmail({
        to: req.body.email,
        subject: "Registration successfully !",
        html: emailHtml,
      });

      // console.log(storeData);
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error" + error);
  }
});

// user Login
// user Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Fill all the details" });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password); // Compare hashed passwords

      // console.log("password"+password);
      // console.log("password"+userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "Invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
});



// user valid
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});



// POST route to handle password reset request
router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userdb.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Generate an OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      // Set OTP and expiration time
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
      await user.save();
  
      // Send OTP in email
      const emailHtml = `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`;
      await sendEmail({ to: email, subject: "Password Reset OTP", html: emailHtml });
  
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // POST route to handle OTP verification and password reset
  router.post("/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await userdb.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
  
      // Hash the new password
      // Update user's password and clear OTP fields
      user.password = newPassword;
      user.cpassword = newPassword; 
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



module.exports = router;



