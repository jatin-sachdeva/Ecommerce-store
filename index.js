const { json } = require('express');
const express = require('express');
const crypto = require('crypto');
const util = require('util');
const fs = require('fs');
const user = require('./repositories/usersRepo');
const cookieSession = require('cookie-session');
const { equal } = require('assert');

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

// siginup , lets user signup through a form and saves the data to the database
app.get('/signup', (req, res) => {
	// sending a html form as response
	res.send(
		`<form method="post">
			<input placeholder="email" name="email" />
			<input placeholder="password"  name="password"/>
			<input placeholder="password confirmation" name="confirmedPassword" />
            <button type="submit">Submit</button>
		</form>`
	);
});

// handelling the post request sent by the form on submission
app.post('/signup', async (req, res) => {
	// first we need to check wether the username already exists and are the passWord and confirm passWord same
	const { email, password, confirmedPassword } = req.body;
	const isPresent = await user.getOneBy({ email });
	if (isPresent) {
		console.log('error repeated user');
		res.send('user already exists!!');
		return;
	} else if (password != confirmedPassword) {
		console.log('passwords dont match');
		res.send('passwords dont match');
		return;
	}
	const userData = await user.create({ email, password });
	// cookie-session willl add 'session'  <object> property to the req object and it will be sent to the browser
	req.session = {
		userId: userData.id
	};
	console.log('created');
	res.send('created!!!');
});

// sign out ,the user is signed out and  session details are dumped
app.get('/signout', (req, res) => {
	req.session = null;
	res.send('you are logged out');
});

// sign in, the user is signed in and the
app.get('/signin', (req, res) => {
	res.send(
		`${req.session.userId}
		<form method="post">
			<input placeholder="email" name="email" />
			<input placeholder="password"  name="password"/>
            <button type="submit">Submit</button>
		</form>
		`
	);
});
app.post('/signin', async (req, res) => {
	// if the credentals entered are correct:
	const { email, password } = req.body;
	const userData = await user.getOneBy({ email });
	if (!userData) res.send('user not found');
	if (!await user.comparePasswords(userData.password, password)) {
		res.send('passwords are wrong');
	}
	// const [ hashPass, salt ] = userData.password.split('.');

	// let checkPass = await scrypt(password, salt, 64);
	// checkPass = checkPass.toString('hex');
	// if (checkPass != hashPass) res.send('password is wrong');
	// create a new session for the user and let him enter the application
	req.session = {
		userId: userData.id
	};
	res.send(`welcome `);
});

app.listen(3000, () => {
	console.log('listening to port 3000 on localhost');
});
