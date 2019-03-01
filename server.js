var path = require('path');
var qs = require('querystring');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var async = require("async");
var Players = require('./api/models/fantasyModel');
var fantasy = require('./data/fantasy');

var clientId = process.env.APP_CLIENT_ID || require('./conf.js').APP_CLIENT_ID;
var clientSecret = process.env.APP_CLIENT_SECRET || require('./conf.js').APP_CLIENT_SECRET;
var redirectUri = process.env.APP_REDIRECT_URI || require('./conf.js').APP_CLIENT_URL;

//setup the express app
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //should this be true?
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
})); //Not sure what this is
app.use(express.static(path.join(__dirname, 'public')));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/fantasydb'); 

var routes = require('./api/routes/fantasyRoutes'); //importing route
routes(app); //register the route

app.get('/', function(req, res) {
    
});

app.get('/logout', function(req, res) {
    delete req.session.token;
    res.clearCookie("leagueId");
    res.clearCookie("teamId");
    res.clearCookie("fantasyPlatform");
    res.clearCookie("yahooAccessToken");
    res.clearCookie("teamSelected");
    res.clearCookie("teamSelectedLabel");
    res.clearCookie("teamSelectedValue");
    res.clearCookie("yahooAccessToken");
    res.clearCookie("teamStatsRecentAvg");
    res.clearCookie("teamStatsSeasonAvg");
    res.clearCookie("teamTradeSelectedLabel");
    res.clearCookie("teamTradeSelectedValue");
    res.clearCookie("yahooEmail");
    res.clearCookie("paid");
    res.clearCookie("dataExpireDate");
    res.clearCookie("teamTradeStatsSeason");
    res.redirect('/');
});

//go to yahoo auth and get back the client data
app.get('/auth/yahoo', function(req, res) {
    var authorizationUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
    var queryParams = qs.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code'
    });

    res.redirect(authorizationUrl + '?' + queryParams);
});

//this is the callback from yahoo. grab the headers and query all the data
app.get('/auth/yahoo/callback', function(req, res) {
    var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
    var options = {
        url: accessTokenUrl,
        headers: { Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64') },
        rejectUnauthorized: false,
        json: true,
        form: {
            code: req.query.code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }
    };

    //Load in all the data
    fantasy.getYahooData(req, res, options);
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});