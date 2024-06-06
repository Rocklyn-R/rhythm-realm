const { userCreate } = require('../models/user');
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

module.exports = {
    createUser,
    checkAuthenticated
}