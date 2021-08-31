// all the helpers functions required in views
module.exports = {
	// field=the input field errors = errors object
	getError: (errors, field) => {
		try {
			console.log(errors.mapped()[field].msg);
			return errors.mapped()[field].msg;
		} catch (err) {
			return '';
		}
	}
};
