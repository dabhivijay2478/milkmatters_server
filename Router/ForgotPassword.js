const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Schema/User/UserSchema'); // Import the user schema
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Generate a random token for password reset
function generateResetToken() {
  return Math.random().toString(36).substr(2, 15);
}

// Send a password reset email
async function sendPasswordResetEmail(user, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other email services as well
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email, // Assuming you have an email field in your user schema
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

// Route to initiate the forgot password process
router.post('/forgot-password', async (req, res) => {
  try {
    const { dairyCode } = req.body;

    // Find the user by dairyCode
    const user = await User.findOne({ dairyCode });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and save it to the user document
    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    await user.save();

    // Send the reset password email to the user
    await sendPasswordResetEmail(user, resetToken);

    return res.status(200).json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Find the user by reset token
    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetToken = undefined; // Clear the reset token
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
