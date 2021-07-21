const express = require('express');

const app = express(); // start the express server

// middleware func provided by express to parse body
// body-parser has been depreciated
app.use(express.urlencoded({ extended: true }));

// a function to respond to the get request to '/' ie the home page
app.get('/', (req, res) => {
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
// // using a  custom middleware function
// const parseData = (req, res, next) => {
// 	req.on('data', (data) => {
// 		// data will be a buffer and has to be converted to string
// 		// all buffer data should be converted to string
// 		const rawData = data.toString();
// 		const dataArr = rawData.split('&');
// 		const formData = {};
// 		dataArr.forEach((curr) => {
// 			const [ key, value ] = curr.split('=');
// 			formData[key] = value;
// 		});
// 		req.body = formData;
// 		next();
// 	});
// };

// handelling the post request sent by thr form on submission
app.post('/', (req, res) => {
	console.log(req.body);
});

app.listen(3000, () => {
	console.log('listening to port 3000 on localhost');
});
