var request = require("request"),
    YahooFantasy = require('yahoo-fantasy'),
    async = require("async"),
    stringSimilarity = require('string-similarity');

var fantasy = require('./fantasy');

var mongoose = require('mongoose'),
    Players = mongoose.model('Players'),
    Teams = mongoose.model('Teams'),
    Scoring = mongoose.model('Scoring'),
    PickupTargetsSeason = mongoose.model('PickupTargetsSeason'),
    PickupTargetsRecent = mongoose.model('PickupTargetsRecent'),
    BBMPickupTargetsSeason = mongoose.model('BBMPickupTargetsSeason'),
    BBMPickupTargetsRecent = mongoose.model('BBMPickupTargetsRecent'),
    PlayerSeasonData = mongoose.model('PlayerSeasonData'),
    PlayerRecentData = mongoose.model('PlayerRecentData'),
    BBMRankingsSeason = mongoose.model('BBMRankingsSeason'),
    BBMRankingsRecent = mongoose.model('BBMRankingsRecent'),
    Payment = mongoose.model('Payment');



var clientId = process.env.APP_CLIENT_ID || require('../conf.js').APP_CLIENT_ID;
var clientSecret = process.env.APP_CLIENT_SECRET || require('../conf.js').APP_CLIENT_SECRET;
var redirectUri = process.env.APP_REDIRECT_URI || require('../conf.js').APP_CLIENT_URL;

var yf = new YahooFantasy(clientId, clientSecret);

exports.refreshYahooData = function (leagueId, res, accessToken) {
    yf.setUserToken(accessToken);
    var players = [];
    var teams = [];
    var teamPlayers = [];
    var playerNames = [];
    var loginExpired = false;

    async.series([
        function (callback) {
            console.log('beginning of first series')
            yf.league.teams(leagueId,
                function cb(err, data) {
                    if (err)
                        console.log(err);
                    else
                        //For each team, grab their team key, id, and name and store it
                        async.forEachOf(data.teams, function (value, teamKey, callback) {
                            console.log('beginning of first async for')
                            var currentTeam = {
                                'team_key': data.teams[teamKey].team_key,
                                'team_id': Number(data.teams[teamKey].team_id),
                                'name': data.teams[teamKey].name
                            }
                            teams.push(currentTeam);

                            callback();
                        }, function (err) {
                            if (err) console.error(err.message);

                            Teams.findOneAndUpdate({
                                leagueId: leagueId
                            }, {
                                    leagueId: leagueId,
                                    teams: teams
                                }, {
                                    upsert: true
                                },
                                function (err, doc) {
                                    // if (err) return 
                                    if (doc !== null) {
                                        doc.teams = teams;
                                    }
                                });

                            //With now having each team key, go through each to get their full roster
                            async.forEachOf(teams, function (value, key, callback) {
                                console.log('beginning of 2nd async for')
                                yf.team.roster(teams[key].team_key,
                                    function cb(err, playersData) {
                                        var teamKey = teams[key].team_key;
                                        if (err)
                                            console.log(err);
                                        else
                                            var teamPlayers = [];

                                        //After having their roster, store each player into a single player array
                                        async.forEachOf(playersData.roster, function (value, playerKey, callback) {
                                            playerObject = {
                                                'team_key': teamKey,
                                                'player_key': playersData.roster[playerKey].player_key,
                                                'player_id': playersData.roster[playerKey].player_id,
                                                'first': playersData.roster[playerKey].name.first,
                                                'last': playersData.roster[playerKey].name.last,
                                                'full': playersData.roster[playerKey].name.full
                                            };
                                            players.push(playerObject);
                                            teamPlayers.push(playerObject);
                                            //push also to specific player name for string similarity later
                                            playerNames.push(playersData.roster[playerKey].name.full);
                                            callback();
                                        }, function (err) {
                                            if (err) console.error(err.message);
                                            callback();
                                        })
                                    }
                                )
                            }, function (err) {

                                console.log('here either?')

                                if (err) console.error(err.message);
                                //Put all the players into the database
                                Players.findOneAndUpdate({
                                    leagueId: leagueId
                                }, {
                                        leagueId: leagueId,
                                        players: players
                                    }, {
                                        upsert: true
                                    },
                                    function (err, doc) {
                                        // if (err) return 
                                        if (doc !== null) {
                                            doc.players = players;
                                        }
                                    });
                                callback(null, 2);
                                return
                            });
                        });
                }  
            )
            console.log('end of first series')
            
        },
        function (callback) {
            console.log('beginning of 2nd series')
            //Use the league ID to get a list of all the teams and their players
            yf.league.settings(leagueId,
                function cb(err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        scoringData = data.settings.stat_categories;
                        var scoringArray = [];
                        for (var i = 0; i < scoringData.length; i++) {
                            if (scoringData[i].display_name !== "H/AB") {
                                scoringArray.push(scoringData[i].display_name)
                            }

                        }
                        Scoring.findOneAndUpdate({
                            leagueId: leagueId
                        }, {
                                leagueId: leagueId,
                                scoring: scoringArray
                            }, {
                                upsert: true
                            },
                            function (err, doc) {
                                // if (err) return 
                                if (doc !== null) {
                                    doc.scoringArray = scoringArray;
                                }
                            });
                            fantasy.getPickups(leagueId, playerNames, res);
                            callback(null, 2);
                    }
                })            
        }
    ])
}