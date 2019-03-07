// Import express and request modules
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const botController = require('./controllers/bot.js');
const hangController = require('./controllers/hang.js');

const PORT = process.env.PORT || 8080;
// Instantiates Express and assigns our app variable to it
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.info(`Express server started on ${PORT}`);
});

app.get('/', (req,res) => res.send("Hello world!"));

app.post('/bot', botController);

app.post('/hang', hangController);
