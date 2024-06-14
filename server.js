const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const initializePassport = require('./config/passport');


const app = express();
const PORT = process.env.PORT || 4000;

const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.set('trust proxy', 1);
app.use(express.static(__dirname));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const wishListRouter = require('./routes/wishList');

app.use('/categories', categoriesRouter)
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/wish-list', wishListRouter);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});

