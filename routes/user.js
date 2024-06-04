const express = require('express');
const passport = require('passport');
const { createUser, checkAuthenticated } = require('../controllers/user');
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
    // Logout the user and provide a callback function
    req.logout((err) => {
        if (err) {
            // Handle any error that occurred during logout
            return res.status(500).json({ error: 'Failed to logout' });
        }
        // Logout successful, send a success response
        return res.status(200).json({ message: 'Logout successful' });
    });
});

userRouter.get('/auth', checkAuthenticated);


module.exports = userRouter;