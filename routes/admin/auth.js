// this route file will have code for the authentication routes

const express = require('express');
const user = require('../../repositories/usersRepo');
const adminLayout = require('../../views/admin/layout');
const signup = require('../../views/admin/auth/signup');
const signin = require('../../views/admin/auth/signin');

/* 
for managing the route handeler (app) that was intiated using express 
we will create a new router using express and export it and link it to the main 
route handler inside the index.js
*/ const router = express.Router();

// siginup , lets user signup through a form and saves the data to the database
router.get('/signup', (req, res) => {
	// sending a html form as response
	res.send(signup());
});

// handelling the post request sent by the form on submission
router.post('/signup', async (req, res) => {
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
router.get('/signout', (req, res) => {
	req.session = null;
	res.send('you are logged out');
});

// sign in, the user is signed in and the
router.get('/signin', (req, res) => {
	res.send(signin({ req }));
});
router.post('/signin', async (req, res) => {
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
module.exports = {
	router
};
