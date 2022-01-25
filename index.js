const express = require('express');
const crypto = require('crypto');
const util = require('util');
const cookieSession = require('cookie-session');
const { router: authRouter } = require('./routes/admin/auth');
const { router: AdminProductRouter } = require('./routes/admin/products');
const { router: productRouter } = require('./routes/products');
const { router: cartsRouter } = require('./routes/carts');

const app = express(); // start the express server
const scrypt = util.promisify(crypto.scrypt);
// middleware func provided by express to parse body
// body-parser has been depreciated
app.use(express.urlencoded({ extended: true }));

// middleware function to set something to session object as a key value pair
app.use(
	cookieSession({
		name: 'session',
		keys: [ 'asurijdnff' ]
	})
);
// public files request handle
app.use(express.static('public')); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!to learn still

app.use(authRouter); // linking the authRouter
app.use(AdminProductRouter); //linking the admin panels product router
app.use(productRouter); //linking the main page, product listing
app.use(cartsRouter);
app.listen(3000, () => {
	console.log('listening to port 3000 on localhost');
});
