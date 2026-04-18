import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Otp from '../models/Otp.js';
import { sendEmail } from '../utils/mailer.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role, skills, interests, location } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            skills,
            interests,
            location,
        });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await Otp.create({ email: user.email, otp });
            await sendEmail({ email: user.email, name: user.name, subject: 'Helplytics Account Verification OTP', otp });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
                message: "Signup successful. Please verify OTP sent to your email."
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
            console.log("Login successful");
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
            console.log("Invalid email or password");
        }
    } catch (error) {
        next(error);
    }
};

export const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({ email, otp });

        await sendEmail({
            email,
            subject: 'Helplytics Verification OTP',
            otp
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const existingOtp = await Otp.findOne({ email, otp });

        if (existingOtp) {
            await Otp.deleteOne({ _id: existingOtp._id });

            await User.findOneAndUpdate({ email }, { isVerified: true });

            res.status(200).json({ success: true, message: 'OTP verified successfully and user account is now verified' });
        } else {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }
    } catch (error) {
        next(error);
    }
};
