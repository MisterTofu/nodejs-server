/* Left of on reset password template
 *
 */

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;


//Import data layer
var mongoose = require('mongoose');
var config = {
/* 	mail: require('./config/mail') */
};

// Import Accounts

var Account = require('./models/Account')(config, mongoose, nodemailer);


app.configure(function(){
	// Jade templates
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb'));	// form parsing and limits POST requests and gaurds against DDOS
	app.use(express.bodyParser()); // form parsing
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "SocialNet secret key", store: new MemoryStore()}
	)),
	mongoose.connect('mongodb://localhost/nodebackbone');
});



app.get('/', function(req, res){
    res.render('index.jade', {layout:false});
});


app.get('/account/authenticated', function(req, res) {
	if( req.session.loggedIn) 
		res.send(200);
	else
		res.send(401);
});

app.post('/register', function(req, res) { 

	var firstName = req.param('firstName', ''); 
	var lastName = req.param('lastName', ''); 
	var email = req.param('email', null);
	var password = req.param('password', null);
	if ( null == email || null == password ) { 
		res.send(400);
		return;
	}
	
	Account.register(email, password, firstName, lastName);
	//Note a call back is required, the response 200 is sent before comfirmation
	res.send(200);
});


app.post('/login', function(req, res) { 
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);
	
	// Checks if email or password is null 
	if ( null == email || email.length < 1 || null == password || password.length < 1 ) {
	    res.send(400);
		return; 
	}
	
	Account.login(email, password, function(success) { 
		if ( !success ) {
            res.send(401);
			return; 
		}
		console.log('login was successful');
		res.send(200);
	}); 
});

app.post('/forgotpassword', function(req, res) {
	var hostname = req.headers.host;
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword'; 
	var email = req.param('email', null);
	if ( null == email || email.length < 1 ) {
	    res.send(400);
		return; 
	}
	
	Account.forgotPassword(email, resetPasswordUrl, function(success){ 
		if (success) 
			res.send(200); 
		else
	      // Username or password not found
	      res.send(404);
	    
	}); 
});


// Specifying port for server
var port = 8080;
app.listen(port);
console.log('Listening on port ' + port);





/*
// Routing

app.get('/stooges/chat', function(req, res, next){
    res.render('chat');
});

io.sockets.on('connection', function(socket){
    var sendChat = function(title, text){
	socket.emit('chat', {
	    title: title,
	    contents: text
	});
    }
    
    setInterval(function() {
	var randomIndex = Math.floor(Math.random() * catchPhrases.length);
	sendChat('Stooge', catchPhrases[randomIndex]);
    }, 5000);
    sendChat('Welcome to Stooge Chat', 'The Stooges are on the line');
    socket.on('chat', function(data) {
	sendChat('You', data.text);
    });
});


app.get('/stooges/:name?', function(req, res, next){
    var name = req.params.name; //get request
    switch( name ? name.toLowerCase() : '') {
	case 'larry':
	case 'curly':
	case 'moe':
	res.render('stooges', { stooge: name});
	break;

	default:
	next();
    }
});
	
app.get('/stooges/*?', function(req, res){
    res.render('stooges', {stooge: null});
});

*/


