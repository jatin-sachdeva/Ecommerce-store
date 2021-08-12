// sigin html document
const layout = require('../layout');
module.exports = ({ req }) => {
	return layout({
		content: `
        <div>
        <h3>your id is ${req.session.userId}</h3>
            <form method="post">
            <input placeholder="email" name="email" />
            <input placeholder="password"  name="password"/>
            <button type="submit">Submit</button>
            </form>
        </div>
    `
	});
};
