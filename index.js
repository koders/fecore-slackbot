// Import express and request modules
const express = require('express');
const bodyParser = require('body-parser');
const botController = require('./bot.js');
const hangController = require('./hang.js');

const PORT = process.env.PORT || 4390;
// Instantiates Express and assigns our app variable to it
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.info(`Express server started on ${PORT}`);
});

const mongoose = require('mongoose');
const { dbUser, dbPass } = process.env;
mongoose.connect(`mongodb://${dbUser}:${dbPass}@ds261155.mlab.com:61155/heroku_58w9h6k4`, {useNewUrlParser: true});

app.get('/', (req,res) => res.send("Hello world!"));

app.post('/bot', botController);

app.post('/hang', hangController);
