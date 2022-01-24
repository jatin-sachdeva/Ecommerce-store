// contains middlewares. utility functions of a sense
const { validationResult } = require('express-validator');
module.exports = {
	// checks for errors detecetd by validatorjs
	// a middle ware always return a function that is ran by express
	// will recieve the view/tempelate that is to be run when errors are detected
	checkErrors(tempelateFunc, optionalFn) {
		return async (req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				let data = {};
				if (optionalFn) {
					data = await optionalFn(req);
				}
				return res.send(tempelateFunc({ errors, ...data }));
				console.log('error spotted');
			}
			next();
		};
	},
	checkCookie(req, res, next) {
		if (!req.session.userId) {
			res.redirect('/signin');
		}
		next();
	}
};
