const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('config');

const app = express();
const username = process.env.SONAR_USER || config.get('user');
const password = process.env.SONAR_PASS || config.get('password');
const sonarHost = process.env.SONAR_HOST || config.get('host');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api/badges/:part', function (req, res) {
	const part = req.params['part'];
	const project = req.query['key'];
	const metric = req.query['metric'];
	const url = `http://${username}:${password}@${sonarHost}/api/badges/${part}?key=${project}&metric=${metric}`;

	request({ url: url }, function (error, response, body) {
		if(error){
			return res.status(500).json({ error: error });
		}

		res.setHeader('Content-Type', 'image/svg+xml');

		return res.end(body);
	});
});

app.listen(process.env.PORT || config.get('port'), function () {
});

module.exports = app;
