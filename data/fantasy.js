var request = require("request"),
    YahooFantasy = require('yahoo-fantasy'),
    async = require("async"),
    stringSimilarity = require('string-similarity');

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

exports.getYahooData = function (req, res, options) {

    request.post(options, function (err, response, body) {
        if (err)
            console.log(err);
        else {
            var teams = [];
            var players = [];
            var playerNames = [];
            var playersDone = false;
            var accessToken = body.access_token;
            var leagueIdShort;
            var leagueId;
            var leagueIds = [];
            var leaguesArray = [];
            var leagues;
            var email;
            var redirectUrl = 0;

            //Get either current year or last year for when season rolls into the new year
            var currentYear = (new Date());
            currentYear = currentYear.getFullYear();

            req.session.token = accessToken;

            yf.setUserToken(accessToken);

            //get the current nba league that the user is in
            //This currently only works for one league, expand later to multiple leagues
            async.series([
                function (callback) {
                    if (err)
                        console.log(err);
                    else
                        //first get the nba leagues user is in 
                        //First call only provides yahoo overall league ID
                        yf.games.user({ seasons: currentYear, game_codes: 'mlb' }, function cb(err, data) {
                            console.log(err)
                            if (err) {
                                return
                            }

                            leagueIdShort = data[0].game_key;

                            //Now that we have overall ID, get user specific league ID
                            yf.user.game_leagues(leagueIdShort, function cb(err, data) {
                                if (data !== undefined) {
                                    leagues = data.games[0].leagues
                                    leagueId = data.games[0].leagues[0][0].league_key;
                                    res.cookie('fantasyPlatform', 'yahoo');
                                    res.cookie('yahooAccessToken', accessToken);
                                    callback(null, 1);
                                }
                            })
                        })
                },
                function (callback) {
                    //Find the users Email address, and then create a db entry for them to track future payments
                    yf.user.game_teams(
                        leagueIdShort,
                        function cb(err, data) {
                            if (err)
                                console.log(err);

                            for (var i = 0; i < leagues.length; i++) {
                                leagueId = leagues[i][0].league_key;
                                
                                email = data.teams[0].teams[0].managers[0].email;

                                var teamId = data.teams[0].teams[i].team_id;
                                var teamName = data.teams[0].teams[i].name;

                                leagueIds.push({
                                    leagueId: leagueId,
                                    teamName: teamName,
                                    teamId: teamId
                                });

                                leaguesArray.push({
                                    leagueId: leagueId,
                                    teamId: teamId
                                })

                                res.cookie('yahooEmail', email);

                                if (email) {
                                    Payment.findOneAndUpdate({
                                        yahooEmail: email
                                    }, {
                                            yahooEmail: email,
                                            leagues: leaguesArray,
                                        }, {
                                            upsert: true
                                        },
                                        function (error, result) {
                                            if (error) {
                                                console.log(error)
                                            } else {
                                                if (result) {
                                                    if (result.paid) {
                                                        res.cookie('paid', true);
                                                    } else {
                                                        res.cookie('paid', false);
                                                    }
                                                } else {
                                                    Payment.create({
                                                        'paymentAmount': 0,
                                                        'yahooEmail': email,
                                                        'leagues': leaguesArray,
                                                        'paid': false,
                                                        'seasonId': leagueIdShort,
                                                        'email': ''
                                                    })
                                                    res.cookie('paid', false);
                                                }
                                            }
                                        });

                                } else {
                                    //Have yahoo email hidden
                                    Payment.findOne({
                                        leagues: {
                                            $elemMatch: {
                                                leagueId: leagueId,
                                                teamId: teamId
                                            }
                                        }
                                    }, function (error, result) {
                                        if (error) {
                                            console.log(error)
                                        } else {
                                            if (result) {
                                                if (result.paid) {
                                                    res.cookie('paid', true);
                                                } else {
                                                    res.cookie('paid', false);
                                                }
                                            } else {
                                                Payment.create({
                                                    'paymentAmount': 0,
                                                    'yahooEmail': email,
                                                    'leagues': {
                                                        leagueId: leagueId,
                                                        teamId: teamId
                                                    },
                                                    'paid': false,
                                                    'seasonId': leagueIdShort,
                                                    'email': ''
                                                })
                                                res.cookie('paid', false);
                                            }
                                        }
                                    })
                                }

                            }
                            callback();
                        }
                    );
                },
                function (callback) {
                    leagueId = leaguesArray[0].leagueId;
                    //If multiple leagues, add it to a cookie
                    res.cookie('leagueIds', JSON.stringify(leagueIds))
                    res.cookie('leagueId', leagueId);
                    res.cookie('teamName', leagueIds[0].teamName);
                    res.cookie('teamId', leaguesArray[0].teamId);
                    //Use the league ID to get a list of all the teams and their players
                    for (var i = 0; i < leagues.length; i++) {
                        playerNames = [];
                        leagueId = leagues[i][0].league_key;
                        yf.league.teams(leagueId,
                            function cb(err, data) {
                                if (err)
                                    console.log(err);
                                else
                                    //For each team, grab their team key, id, and name and store it
                                    async.forEachOf(data.teams, function (value, teamKey, callback) {
                                        var currentTeam = {
                                            'team_key': data.teams[teamKey].team_key,
                                            'team_id': Number(data.teams[teamKey].team_id),
                                            'name': data.teams[teamKey].name
                                        }
                                        teams.push(currentTeam);

                                        // if (data.teams[teamKey].is_owned_by_current_login !== undefined) {
                                        //     res.cookie('teamId', data.teams[teamKey].team_id)
                                        // }


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
                                            redirectUrl += 1;

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

                                            getPickups(leagueId, playerNames);
                                            if (redirectUrl === leagues.length) {
                                                res.redirect('/');
                                            }
                                            return
                                        });
                                    });
                            }
                        )
                    }
                    callback(null, 2);
                },
                function (callback) {
                    //Use the league ID to get a list of all the teams and their players
                    for (var i = 0; i < leagues.length; i++) {
                        leagueId = leagues[i][0].league_key;
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
                                }
                            })
                    }
                    callback(null, 2);
                }
            ]);
        }
    });

}

function getPickups(leagueId, playerNames) {
    if (playerNames.length > 0) {
        var rankingsSeason = [];
        var rankingsRecent = [];

        PlayerSeasonData.find({}, function (err, players) {
            if (err)
                res.send(err);
            var pickupTargets = [];
            async.forEachOf(players, function (value, i, callback) {

                var similarPlayer = stringSimilarity.findBestMatch(players[i].playerName, playerNames);
                var similarPlayerRating = similarPlayer.bestMatch.rating;

                if (similarPlayerRating < 0.65) {
                    pickupTargets.push(players[i]);
                }

                callback();
            }, function (err) {
                if (err)
                    res.send(err);

                PickupTargetsSeason.findOneAndUpdate({
                    leagueId: leagueId
                }, {
                        leagueId: leagueId,
                        players: pickupTargets
                    }, {
                        upsert: true
                    },
                    function (err, doc) {
                        if (err)
                            res.send(err);

                        if (doc !== null) {
                            doc.players = pickupTargets;
                        }
                    });
                return
            })
        });

        PlayerRecentData.find({}, function (err, players) {
            if (err)
                res.send(err);
            var pickupTargets = [];
            async.forEachOf(players, function (value, i, callback) {

                var similarPlayer = stringSimilarity.findBestMatch(players[i].playerName, playerNames);
                var similarPlayerRating = similarPlayer.bestMatch.rating;

                if (similarPlayerRating < 0.7) {
                    pickupTargets.push(players[i]);
                }

                callback();
            }, function (err) {
                if (err)
                    res.send(err);

                PickupTargetsRecent.findOneAndUpdate({
                    leagueId: leagueId
                }, {
                        leagueId: leagueId,
                        players: pickupTargets
                    }, {
                        upsert: true
                    },
                    function (err, doc) {
                        if (err)
                            res.send(err);

                        if (doc !== null) {
                            doc.players = pickupTargets;
                        }
                    });
                return
            })
        });

        BBMRankingsSeason.find({}, function (err, players) {
            if (err)
                res.send(err);
            var pickupTargets = [];
            async.forEachOf(players, function (value, i, callback) {

                var similarPlayer = stringSimilarity.findBestMatch(players[i].playerName, playerNames);
                var similarPlayerRating = similarPlayer.bestMatch.rating;

                if (similarPlayerRating < 0.7) {
                    pickupTargets.push(players[i]);
                }

                callback();
            }, function (err) {
                if (err)
                    res.send(err);

                BBMPickupTargetsSeason.findOneAndUpdate({
                    leagueId: leagueId
                }, {
                        leagueId: leagueId,
                        players: pickupTargets
                    }, {
                        upsert: true
                    },
                    function (err, doc) {
                        if (err)
                            res.send(err);

                        if (doc !== null) {
                            doc.players = pickupTargets;
                        }
                    });
                return
            })
        });

        BBMRankingsRecent.find({}, function (err, players) {
            if (err)
                res.send(err);
            var pickupTargets = [];

            async.forEachOf(players, function (value, i, callback) {

                var similarPlayer = stringSimilarity.findBestMatch(players[i].playerName, playerNames);
                var similarPlayerRating = similarPlayer.bestMatch.rating;

                if (similarPlayerRating < 0.7) {
                    pickupTargets.push(players[i]);
                }

                callback();
            }, function (err) {
                if (err)
                    res.send(err);

                BBMPickupTargetsRecent.findOneAndUpdate({
                    leagueId: leagueId
                }, {
                        leagueId: leagueId,
                        players: pickupTargets
                    }, {
                        upsert: true
                    },
                    function (err, doc) {
                        if (err)
                            res.send(err);

                        if (doc !== null) {
                            doc.players = pickupTargets;
                        }
                    });
                return
            })
        });
    }
}

exports.getEspnData = function (espnId, res) {
    var url = 'http://fantasy.espn.com/apis/v3/games/flb/seasons/2019/segments/0/leagues/' + espnId + '?view=mRoster&view=mTeam&view=mSettings';
    var teams = [];
    var players = [];
    var playerNames = [];

    console.log(url)

    var scoringCats = {
        AB: 0,
        H: 1,
        AVG: 2,
        '2B': 3,
        '3B': 4,
        HR: 5,
        XBH: 6,
        '1B': 7,
        TB: 8,
        SLG: 9,
        BB: 10,
        IBB: 11,
        HBP: 12,
        SF: 13,
        SH: 14,
        SAC: 15,
        PA: 16,
        OBP: 17,
        OPS: 18,
        RC: 19,
        R: 20,
        RBI: 21,
        GWRBI: 22,
        SB: 23,
        CS: 24,
        SBN: 25,
        GIDP: 26,
        KO: 27,
        TP: 28,
        PPA: 29,
        CVC: 30,
        GSHR: 31,
        APP: 32,
        GS: 33,
        IP: 34,
        BF: 35,
        PC: 36,
        HA: 37,
        BAA: 38,
        BBI: 39,
        IBII: 40,
        WHIP: 41,
        HB: 42,
        OBA: 43,
        RA: 44,
        ER: 45,
        HRA: 46,
        ERA: 47,
        K: 48,
        'K/9': 49,
        WP: 50,
        B: 51,
        PKO: 52,
        W: 53,
        L: 54,
        'WIN%': 55,
        SOP: 56,
        SV: 57,
        BS: 58,
        'SV%': 59,
        HD: 60,
        IRS: 61,
        CG: 62,
        QS: 63,
        SO: 64,
        NH: 65,
        PG: 66,
        FC: 67,
        PO: 68,
        AST: 69,
        OFAST: 70,
        FPCT: 71,
        E: 72,
        DPT: 73,
        BTW: 74,
        BTL: 75,
        PTW: 76,
        PTL: 77,
        SFA: 78,
        SHA: 79,
        CIA: 80,
        GP: 81,
        'K/BB': 82,
        SVHD: 83,
        PBS: 99
    }

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (error) {
            res.send(error)
        }

        if (body.messages !== undefined) {
            res.send(body).end();
            return;
        }

        var teamData = body.teams;
        var teamPlayersArray = [];
        var scoringArray = []
        var scoringData = body.settings.scoringSettings.scoringItems

        //Loop through the 10 teams to get each team name and players
        for (var i = 0; i < teamData.length; i++) {
            var teamName = teamData[i].location + " " + teamData[i].nickname;
            var teamPlayers = teamData[i].roster.entries;
            var teamId = teamData[i].id;
            //Loop through the players to add to an array
            for (var j = 0; j < teamPlayers.length; j++) {
                playerObject = {
                    //Adding in the .t. to the teamkey to keep it consistant with yahoo's format
                    'team_key': espnId + '.t.' + teamId,
                    'player_id': teamPlayers[j].playerPoolEntry.id,
                    'first': teamPlayers[j].playerPoolEntry.player.firstName,
                    'last': teamPlayers[j].playerPoolEntry.player.lastName,
                    'full': teamPlayers[j].playerPoolEntry.player.fullName
                };
                players.push(playerObject);
                playerNames.push(teamPlayers[j].playerPoolEntry.player.fullName);
            }

            //Push the team name and the players to an array
            teams.push({
                name: teamName,
                team_id: teamId,
                league_id: espnId
            });
        }

        for (var j = 0; j < scoringData.length; j++) {
            scoringId = scoringData[j].statId
            scoringArray.push(Object.keys(scoringCats)[scoringId])
        }

        //Submit all the teams to mongo
        Teams.findOneAndUpdate({
            leagueId: espnId
        }, {
                leagueId: espnId,
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

        //Submit all players to mongo
        Players.findOneAndUpdate({
            leagueId: espnId
        }, {
                leagueId: espnId,
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

        Scoring.findOneAndUpdate({
            leagueId: espnId
        }, {
                leagueId: espnId,
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

        getPickups(espnId, playerNames)

        //Send the data back
        res.json(teams);
    });
}

exports.getPrivateESPNData = function() {
    console.log('here')
    const puppeteer = require('puppeteer');

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://espn.com');
      await page.click('#global-user-trigger');
      await page.screenshot({path: './screenshot.png'});
    
      await browser.close();
    })();
}

exports.refreshYahooData = function (leagueId, res, accessToken) {
    yf.setUserToken(accessToken);
    var players = [];
    var teamPlayers = [];
    var playerNames = [];
    var loginExpired = false;

    yf.league.teams(leagueId,
        function cb(err, data) {
            if (err) {
                res.status(400).send(err);
                return
            }
            else {
                async.forEachOf(data.teams, function (value, key, callback) {
                    yf.team.roster(data.teams[key].team_key,
                        function cb(err, playersData) {
                            var teamKey = data.teams[key].team_key;

                            if (err) {
                                console.log(err)
                            } else {
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
                        }
                    )
                }, function (err) {
                    if (err) {
                        console.error(err.message)
                    } else {
                        // Put all the players into the database
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

                        getPickups(leagueId, playerNames);
                        res.json("Yahoo update successful");
                        return
                    }
                });
            }
        });
}