// it will contain all the validator and sanitixor code for the project
const { validationResult, check } = require('express-validator');

const user = require('../../repositories/usersRepo');

module.exports = {
	// for signup
	getEmail: check('email').trim().normalizeEmail().isEmail().withMessage('invalid email').custom(async (value) => {
		if (await user.getOneBy({ email: value })) throw new Error('email already exists');
	}),
	getPassword: check('password')
		.trim()
		.isLength({ min: 4, max: 8 })
		.withMessage('password should be of 4 to 8 characters long'),
	getPasswordConfirmation: check('confirmedPassword')
		.trim()
		.isLength({ min: 4, max: 8 })
		.withMessage('password should be of 4 to 8 characters long')
		.custom(async (value, { req }) => {
			if (value != req.body.password) throw new Error('passwords dont match');
		}),
	// for signin
	validateEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('invalid email')
		.custom(async (value) => {
			if (!await user.getOneBy({ email: value })) throw new Error("email doesn't exist");
		}),
	validatePassword: check('password').trim().custom(async (password, { req }) => {
		const { email } = req.body;
		const userData = await user.getOneBy({ email: email });
		if (!userData) throw new Error('invalid password');
		const isUser = await user.comparePasswords(userData.password, password);
		if (!isUser) throw new Error('password is wrong');
	})
};
