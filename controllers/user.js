const { userCreate, userNameUpdate, emailUpdate, findUserById, passwordUpdate, findUserByEmail, tokenAdd, tokenCheck, passwordReset } = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await userCreate(first_name, last_name, email, hashedPassword);
        req.login(newUser, (err) => {
            if (err) {
                console.error('Error logging in user:', err);
                res.status(500).json({ message: 'Failed to log in user' });
            } else {
                res.status(200).json({ user: req.user })
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(200).json({ message: "User not signed in" });
}

const updateUserName = async (req, res) => {
    const { first_name, last_name } = req.body;
    const id = req.user.id;

    try {
        const result = await userNameUpdate(first_name, last_name, id);
        if (result) {
            res.status(200).json({ message: "Successful User Name Update" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


const updateEmail = async (req, res) => {
    const { email } = req.body;
    const id = req.user.id;

    try {
        const result = await emailUpdate(email, id);
        if (result) {
            res.status(200).json({ message: "Successful User Name Update" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    try {
        const user = await findUserById(id);
        const password = user.password;
        const salt = await bcrypt.genSalt(10);
        const matchedPassword = await bcrypt.compare(oldPassword, password);
        if (matchedPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            const userPasswordChange = await passwordUpdate(hashedNewPassword, id);
            if (userPasswordChange) {
                res.status(200).json({ message: 'Password change successful' });
            } else {
                res.status(404).json({ message: 'Password change failed' });
            }
        } else {
            res.status(404).json({ message: 'Old password incorrect' })
        }
    } catch (error) {
        console.log('Error changing password:', error);
    }
}

const checkForUserEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const result = await findUserByEmail(email);
        if (result) {
            res.status(200).json({ message: "User found" })
        } else {
            res.status(200).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(404).json({ message: "An error occurred." })
    }
}

function generateResetToken() {
    return crypto.randomBytes(20).toString('hex'); // 20 bytes => 40 characters
}

const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    console.log("THIS BE RUNNIN");
    try {
        // Check if the user exists
        const userResult = await findUserByEmail(email);
        console.log(email);
        if (!userResult) {
            console.log("USER NOT FOUND")
            return res.status(404).json({ message: "User not found" });
        }

        const userId = userResult.id;
        const token = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const addToken = await tokenAdd(userId, token, expiresAt);
        console.log(addToken);
        // Generate a password reset link
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // Configure email transporter (using Gmail as an example)
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        if (addToken) {
            // Send the email
            await transporter.sendMail({
                from: '"Rocklyn Apps" <rocklyn.apps@gmail.com>',
                to: email,
                subject: "Password Reset Request - Rhythm Realm",
                html: `<p>Click <a href="${resetLink}">here</a> to reset your Rhythm Realm password. This link will expire in 1 hour.</p>`,
            });

            return res.json({ message: "Reset email sent successfully" });
        }

    } catch (error) {
        console.log(error);
        console.error("Error sending reset email:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const checkToken = async (req, res) => {
    const { token } = req.query;
    try {
        const result = await tokenCheck(token);
        if (result) {
            res.status(200).json({ valid: result.valid, message: result.message, user_id: result.user_id })
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const resetPassword = async (req, res) => {
    const { password, user_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await passwordReset(hashedPassword, user_id);
        if (result) {
            res.status(200).json({ valid: result.valid, message: result.message, user_id: result.user_id })
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createUser,
    checkAuthenticated,
    updateUserName,
    updateEmail,
    updateUserPassword,
    checkForUserEmail,
    sendResetEmail,
    checkToken,
    resetPassword
}