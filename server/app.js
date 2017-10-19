const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoClient = require('./lib/mongo');
const mainController = require('./controllers/main');
const saveController = require('./controllers/save');
const sslRedirect = require('./middleware/https');

const app = new express();
app.use(compression());
app.use(sslRedirect());

let handlebars = exphbs.create({extname: '.html'});
app.engine('html', handlebars.engine);
app.set('view engine', '.html');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', mainController);
app.get('/test', mainController);
app.post('/api/save', saveController);

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
