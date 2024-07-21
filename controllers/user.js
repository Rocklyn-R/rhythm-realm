const { userCreate, userNameUpdate, emailUpdate, findUserById, passwordUpdate } = require('../models/user');
const bcrypt = require('bcrypt');

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

module.exports = {
    createUser,
    checkAuthenticated,
    updateUserName,
    updateEmail,
    updateUserPassword
}