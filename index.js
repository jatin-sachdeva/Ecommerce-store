const express = require('express');
const crypto = require('crypto');
const util = require('util');
const cookieSession = require('cookie-session');
const { router: authRouter } = require('./routes/admin/auth');
const { router: productRouter } = require('./routes/admin/products');

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
app.use(productRouter); //linking the product router
app.listen(3000, () => {
	console.log('listening to port 3000 on localhost');
});
