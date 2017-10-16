const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoClient = require('./lib/mongo');
const mainController = require('./controllers/main');
const subsController = require('./controllers/subscribe');
const updateController = require('./controllers/update');

const app = new express();

let handlebars = exphbs.create({extname: '.html'});
app.engine('html', handlebars.engine);
app.set('view engine', '.html');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', mainController);
app.post('/api/subscribe', subsController);
app.post('/api/update-mons', updateController);

// wait until we're connected to mongo
const listen = mongoClient
	.then(() => {
		return app.listen(process.env.PORT || 8888);
	})
	.catch(error => {
		throw new Error(error);
	});

module.exports = {
	listen
};
