"abcbkk34"
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Signup controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10); // Hashing the password
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); // Saving the new user to the database
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error); // Passing error to the error handler middleware
  }
};

// Signin controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); // Finding user by email
    if (!validUser) return next(errorHandler(404, 'User not found!')); // User not found
    const validPassword = bcryptjs.compareSync(password, validUser.password); // Comparing password
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!')); // Invalid password
    const token = jwt.sign({ id: validUser._id }, "abcbkk34"); // Generating JWT
    const { password: pass, ...rest } = validUser._doc; // Excluding password from response
    res
      .cookie('access_token', token, { httpOnly: true }) // Setting JWT in cookie
      .status(200)
      .json(rest); // Sending response with user data
  } catch (error) {
    next(error); // Passing error to the error handler middleware
  }
};

// Google Signin/Signup controller
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // Finding user by email
    if (user) {
      const token = jwt.sign({ id: user._id }, "abcbkk34"); // Generating JWT
      const { password: pass, ...rest } = user._doc; // Excluding password from response
      res
        .cookie('access_token', token, { httpOnly: true }) // Setting JWT in cookie
        .status(200)
        .json(rest); // Sending response with user data
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Generating a random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hashing the password
      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), // Generating a unique username
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save(); // Saving the new user to the database
      const token = jwt.sign({ id: newUser._id }, "abcbkk34"); // Generating JWT
      const { password: pass, ...rest } = newUser._doc; // Excluding password from response
      res
        .cookie('access_token', token, { httpOnly: true }) // Setting JWT in cookie
        .status(200)
        .json(rest); // Sending response with user data
    }
  } catch (error) {
    next(error); // Passing error to the error handler middleware
  }
};
export const signOut = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };
