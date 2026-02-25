import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";


export const register = async (req, res, next) => {
    const session = mongoose.startSession();
    await session.startTransaction();
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email }, { session });
        if (user) {
            await session.abortTransaction();
            session.endSession();
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        const salt = await genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password: hashedPassword }, { session });
        await session.commitTransaction();
        session.endSession();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
        })
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
        })
        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        next(error);
    }
}


export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        next(error);
    }
}
