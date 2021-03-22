const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('config');

const app = express();

const proxyConfig = config.get('proxy');
const sonarqubeConfig = config.get('sonarqube');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.get('/api/project_badges/measure/', function (req, res) {
    const project = req.query['project'];
    const metric = req.query['metric'];

    request.post(
        `${sonarqubeConfig.host}/api/authentication/login`,
        {
            form: {
                login: sonarqubeConfig.login,
                password: sonarqubeConfig.password
            }
        },
        function (error, response, body) {
            if (response.statusCode === 200) {
                request({
                        url: `${sonarqubeConfig.host}/api/project_badges/measure?project=${project}&metric=${metric}`,
                        method: "GET",
                        headers: {
                            'Cookie': response.headers['set-cookie']
                        }
                    },
                    function (inError, inResponse, inBody) {
                        if (inResponse.statusCode === 200) {
                            res.setHeader('Content-Type', inResponse.headers['content-type']);
                            return res.end(inBody);
                        } else {
                            return res.status(401).json({error: true});
                        }
                    }
                );
            } else {
                return res.status(401).json({error: true});
            }
        }
    );

});

app.listen(proxyConfig.port, function () {
});

module.exports = app;
