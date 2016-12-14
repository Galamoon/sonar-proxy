const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api/badges/:part', function (req, res) {
	const part = req.params['part'];
	const project = req.query['key'];
	const metric = req.query['metric']
	const username = process.env.USER || '';
	const password = process.env.PASS || '';
	const sonarHost = process.env.HOST || '';
	const url = `http://${username}:${password}@${sonarHost}/api/badges/${part}?key=${project}&metric=${metric}`;

	request({ url: url }, function (error, response, body) {
		if(error){
			return res.status(500);
		}

		res.setHeader('Content-Type', 'image/svg+xml');

		return res.end(body);
	});
});

app.listen(process.env.PORT || 8081, function () {
});

module.exports = app;
