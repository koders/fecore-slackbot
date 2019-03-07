// Import express and request modules
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const botController = require('./controllers/bot.js');
const hangController = require('./controllers/hang.js');

// Slack config
const clientId = '2369683355.569488704771';
const clientSecret = 'ab2c9ae74104dec11ec8dca2be1807c9';
const PORT=4390;

// Instantiates Express and assigns our app variable to it
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.info(`Express server started on ${PORT}`);
});

app.post('/bot', botController);

app.post('/hang', hangController);
