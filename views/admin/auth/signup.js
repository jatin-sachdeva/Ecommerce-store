// signup html document
const layout = require('../layout');
const { getError } = require('../../helpers/helpers'); // helper function to manage the errors and the way they are displayed

// module.exports = ({ req, errors }) => {
// 	return layout({
// 		content: `
//     <div>
//         <form method="post">
//                 <input placeholder="email" name="email" />
//                 ${getError('email', errors)}
//                 <input placeholder="password"  name="password"/>
//                 ${getError('password', errors)}
//                 <input placeholder="password confirmation" name="confirmedPassword" />
//                 ${getError('confirmedPassword', errors)}
//                 <button type="submit">Submit</button>
//         </form>
//     </div>
//     `
// 	});
// };
module.exports = ({ req, errors }) => {
	return layout({
		content: `
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-one-quarter">
              <form method="POST">
                <h1 class="title">Sign Up</h1>
                <div class="field">
                  <label class="label">Email</label>
                  <input required class="input" placeholder="Email" name="email" />
                  <p class="help is-danger">${getError(errors, 'email')}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <input required class="input" placeholder="Password" name="password" type="password" />
                  <p class="help is-danger">${getError(errors, 'password')}</p>
                </div>
                <div class="field">
                  <label class="label">Password Confirmation</label>
                  <input required class="input" placeholder="confirmedPassword" name="confirmedPassword" type="password" />
                  <p class="help is-danger">${getError(errors, 'confirmedPassword')}</p>
                </div>
                <button class="button is-primary">Submit</button>
              </form>
              <a href="/signin">Have an account? Sign In</a>
            </div>
          </div>
        </div>
      `
	});
};
