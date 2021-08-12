// signup html document
const layout = require('../layout');
module.exports = () => {
	return layout({
		content: `
    <div>
        <form method="post">
                <input placeholder="email" name="email" />
                <input placeholder="password"  name="password"/>
                <input placeholder="password confirmation" name="confirmedPassword" />
                <button type="submit">Submit</button>
        </form>
    </div>
    `
	});
};
