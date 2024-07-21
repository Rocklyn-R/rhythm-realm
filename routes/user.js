const express = require('express');
const passport = require('passport');
const { createUser, checkAuthenticated, updateUserName, updateEmail, updateUserPassword } = require('../controllers/user');
const router = express.Router();

const userRouter = express.Router();

userRouter.post('/signup', createUser);

userRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failure',
  }), (req, res) => {
    return res.status(200).send({ user: req.user });
  });

userRouter.post('/login-failure', (req, res) => {
    res.status(401).json({ message: "Incorrect email or password" })
})

userRouter.get('/logout', checkAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        return res.status(200).json({ message: 'Logout successful' });
    });
});

userRouter.get('/auth', checkAuthenticated, (req, res) => {
    return res.status(200).json({ user: req.user })
});

userRouter.put('/user-name', checkAuthenticated, updateUserName);

userRouter.put('/email', checkAuthenticated, updateEmail);

userRouter.put('/update-password', checkAuthenticated, updateUserPassword);

module.exports = userRouter;