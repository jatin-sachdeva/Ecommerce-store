const express = require('express');
const app = express(); // start the express server

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
// handelling the post request sent by thr form on submission
app.post('/', (req, res) => {
	//  looking for a data event on the req
	req.on('data', (data) => {
		// data will be a buffer and has to be converted to string
		// all buffer data should be converted to string
		const rawData = data.toString();

		const formData = parseData(rawData);
		console.log(formData);
	});
});
const parseData = (rawData) => {
	const dataArr = rawData.split('&');
	const formData = {};
	dataArr.forEach((curr) => {
		const [ key, value ] = curr.split('=');
		formData[key] = value;
	});
	return formData;
};
// lspecify the port no to listen the traffic from;
app.listen(3000, () => {
	console.log('listening to port 3000 on localhost');
});
