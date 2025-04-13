import { userModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//* register user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User Already Exists !",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json({
      message: "User Registered Successfully",
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: `Error registering user : ${e.message}`,
      success: false,
    });
  }
};

//* login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found !!", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: `Error loggin in : ${e.message}`,
      success: false,
    });
  }
};
