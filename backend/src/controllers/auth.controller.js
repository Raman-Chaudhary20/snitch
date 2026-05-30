import userModel from "../models/user.model.js ";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User registered successfully",
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      contact: user.contact,
      role: user.role,
    },
  });
}

export const registerController = async (req, res) => {
  const { email, password, fullname, contact, role } = req.body;

  try {
    const user = await userModel.findOne({ $or: [{ email }, { contact }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new userModel({
      email,
      password,
      fullname,
      contact,
      role,
    });

    await newUser.save();
    await sendTokenResponse(newUser, res);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    await sendTokenResponse(user, res);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleCallback = async (req, res) => {

  const { emails, id, displayName, photos } = req.user;
  let user = await userModel.findOne({ email: emails[0].value });
  let photo = photos[0].value;

  if (!user) {
    user = userModel.create({
      email: emails[0].value,
      fullname: displayName,
      googleId: id,
    });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });

  res.cookie("token", token);

  await sendTokenResponse(user, res);
};

export const getMe = async (req, res)=>{
const user = req.user;
res.status(200).json({
  message: "User fetched successfully",
  success: true,  user: {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    contact: user.contact,
    role: user.role,
  }
})
}
