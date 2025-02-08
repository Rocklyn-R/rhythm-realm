const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore; // Notice the change
const { createClient } = require('redis');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const initializePassport = require('./config/passport');


const app = express();
const PORT = process.env.PORT || 4000;

const COOKIE_SECRET = process.env.COOKIE_SECRET;

const corsOptions = {
    origin: [
        '*',
        'http://localhost:3000',
        'https://accounts.google.com',  // Keeping the Google origin
        'https://rhythm-realm.onrender.com',
        'https://rhythm-realm-backend.onrender.com',
        'https://*.onrender.com'
    ],
    credentials: true, // Allow credentials (cookies, Authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept' ]
};
// Handle preflight requests
app.options('*', cors(corsOptions));
// Apply CORS middleware before your routes
app.use(cors(corsOptions));


app.set('trust proxy', 1);
app.use(express.static(__dirname));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const redisUrl = process.env.NODE_ENV === 'development' ? 'rediss://red-csb5ltogph6c73aaak60:0SR0RXoGw6haTyYewERfjKB0p1LfTPPJ@virginia-redis.render.com:6379' : 'redis://red-csb5ltogph6c73aaak60:6379'; // Use external Redis URL in developmentn
// Create a Redis client

const redisClient = createClient({
    url: redisUrl,
    prefix: 'app1:sess:'
});

// Connect to Redis
redisClient.connect().catch(err => {
    console.error('Could not connect to Redis:', err);
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
  
await redisClient.set('123Antica', 'Vatamo te');
const value = await redisClient.get('123Antica');
console.log("found value: ", value);  
})();

// Set up session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET,
    proxy: true, // Required when behind a proxy like Render
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax' // Allows cookies to be sent in cross-site contexts (e.g., if front end is on a different domain)
    }
  }));

  console.log(process.env.NODE_ENV);
/*
app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));*/

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const wishListRouter = require('./routes/wishList');
const searchRouter = require('./routes/search');
const ordersRouter = require('./routes/orders');
const addressBookRouter = require('./routes/addressBook');

app.use('/categories', categoriesRouter)
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/wish-list', wishListRouter);
app.use('/search', searchRouter);
app.use('/orders', ordersRouter);
app.use('/address-book', addressBookRouter);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});

