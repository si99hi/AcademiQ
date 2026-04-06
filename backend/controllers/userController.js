import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '30d',
  });
};

// Register new user (Sends OTP)
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email && !userExists.isVerified) {
        // Resend OTP if user exists but not verified
        const otp = generateOTP();
        userExists.verificationOtp = otp;
        userExists.verificationOtpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
        
        if (password) {
           const salt = await bcrypt.genSalt(10);
           userExists.password = await bcrypt.hash(password, salt);
        }
        await userExists.save();

        const mailResult = await sendEmail({
          email: userExists.email,
          subject: 'Verify your AcademiQ account',
          message: `Your verification OTP is: ${otp}\nThis code is valid for 10 minutes.`
        });
        return res.status(200).json({
          message: mailResult.ok
            ? 'User exists but not verified. New OTP sent to email'
            : 'Account updated, but the verification email could not be sent. Try Resend OTP or check server email settings.',
          email: userExists.email,
          emailSent: mailResult.ok,
        });
      }
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isVerified: false,
      verificationOtp: otp,
      verificationOtpExpire: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    if (user) {
      const mailResult = await sendEmail({
        email: user.email,
        subject: 'AcademiQ - Account Verification',
        message: `Hello ${user.firstName},\n\nWelcome to AcademiQ! Your verification OTP is: ${otp}\nThis code is valid for 10 minutes.\n\nBest regards,\nAcademiQ Team`
      });

      res.status(201).json({
        message: mailResult.ok
          ? 'User registered. Please check email for OTP verification.'
          : 'Account created, but the verification email could not be sent. Use Resend OTP after fixing SMTP, or contact support.',
        email: user.email,
        emailSent: mailResult.ok,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email API
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ 
      email, 
      verificationOtp: otp,
      verificationOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpire = undefined;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
      message: 'Email verified successfully! You are now logged in.'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Your email is not verified. Please verify your email first.' });
      }

      user.lastLogin = Date.now();
      await user.save();

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailResult = await sendEmail({
      email: user.email,
      subject: 'AcademiQ - Password Reset OTP',
      message: `Hello ${user.firstName},\n\nYou requested a password reset. Your OTP is: ${otp}\nThis code is valid for 10 minutes.\nIf you did not request this, please ignore this email.`
    });
    if (!mailResult.ok) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent. Check SMTP settings on the server.' });
    }
    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ 
      email, 
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};