'use strict';

var fantasy = require('../../data/fantasy');
var rankings = require('../../data/rankings');

var mongoose = require('mongoose'),
    Players = mongoose.model('Players'),
    Teams = mongoose.model('Teams'),
    BBMRankingsSeason = mongoose.model('BBMRankingsSeason'),
    BBMRankingsRecent = mongoose.model('BBMRankingsRecent'),
    PickupTargetsSeason = mongoose.model('PickupTargetsSeason'),
    PickupTargetsRecent = mongoose.model('PickupTargetsRecent'),
    BBMPickupTargetsSeason = mongoose.model('BBMPickupTargetsSeason'),
    BBMPickupTargetsRecent = mongoose.model('BBMPickupTargetsRecent'),
    PlayerSeasonData = mongoose.model('PlayerSeasonData'),
    PlayerRecentData = mongoose.model('PlayerRecentData'),
    Payment = mongoose.model('Payment');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || require('../../conf.js').STRIPE_SECRET_KEY);

exports.list_all_players = function (req, res) {
    Players.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_season_pickups = function (req, res) {
    PickupTargetsSeason.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_recent_pickups = function (req, res) {
    PickupTargetsRecent.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_season_bbm_pickups = function (req, res) {
    BBMPickupTargetsSeason.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_recent_bbm_pickups = function (req, res) {
    BBMPickupTargetsRecent.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_teams = function (req, res) {
    Teams.find({ leagueId: req.params.leagueId }, function (err, teams) {
        if (err)
            res.send(err);
        res.json(teams);
    });
};

exports.list_teams_players = function (req, res) {
    var teamKey = req.params.leagueId + '.t.' + req.params.teamKey;
    Players.find({ leagueId: req.params.leagueId }, function (err, players) {
        if (err)
            res.send(err);

        players = players[0].players;

        var teamPlayers = [];
        for (var i = 0; i < players.length; i++) {
            if (players[i].team_key === teamKey) {
                teamPlayers.push(players[i])
            }
        }
        res.json(teamPlayers);
    });
};

exports.list_season_rankings = function (req, res) {
    PlayerSeasonData.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_recent_rankings = function (req, res) {
    PlayerRecentData.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_season_bbm_rankings = function (req, res) {
    BBMRankingsSeason.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.list_recent_bbm_rankings = function (req, res) {
    BBMRankingsRecent.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
};

exports.erase_current_data = function (req, res) {
    // BBMRankingsSeason.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    //     // res.json({ message: 'All teams successfully deleted' });
    // });
    // BBMRankingsRecent.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    //     // res.json({ message: 'All teams successfully deleted' });
    // });
    // Teams.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    //     // res.json({ message: 'All teams successfully deleted' });
    // });
    // PickupTargetsSeason.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    // });

    // PickupTargetsTwoWeeks.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    // });
    // Teams.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    // });
    // Players.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    //     res.json({ message: 'All players successfully deleted' });
    // });

    // Payment.remove({}, function (err, task) {
    //     if (err)
    //         res.send(err);
    //     res.json({ message: 'All players successfully deleted' });
    // });
};

exports.get_rankings = function (req, res) {
    rankings.getRankings(req, res);
    rankings.getBBMRankings(req, res);
    res.json("Rankings Completed");
}

exports.get_player_season_data = function (req, res) {
    PlayerSeasonData.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
}

exports.get_player_recent_data = function (req, res) {
    PlayerRecentData.find({}, function (err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
}

exports.get_espn_data = function (req, res) {
    fantasy.getEspnData(req.params.espnId, res);
    // res.json(req.params.espnId);
}

exports.refresh_yahoo_data = function (req, res) {
    var cookies = req.headers.cookie;
    cookies = cookies.split("; ")

    for (var i = 0; i < cookies.length; i++) {
        var cookieName = cookies[i].split('=')[0];
        var cookieValue = cookies[i].split('=')[1];

        if (cookieName === "yahooAccessToken") {
            var yahooAccessToken = cookieValue;
        }
        if (cookieName === "leagueId") {
            var leagueId = cookieValue;
        }
    }

    fantasy.refreshYahooData(leagueId, res, yahooAccessToken)
}

exports.payment_get = function (req, res) {
    Payment.find({}, function (err, payments) {
        if (err)
            res.send(err);
        res.json(payments);
    });
}
exports.payment_post = function (req, res) {
    var status;
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: "usd"
    };
    stripe.charges.create(body, stripeChargeCallback(res, req));
}

const stripeChargeCallback = (res, req) => (stripeErr, stripeRes) => {
    if (stripeErr) {
        res.status(500).send({ error: stripeErr });
    } else {
        var cookies = req.headers.cookie;
        cookies = cookies.split("; ")
        for (var i = 0; i < cookies.length; i++) {
            var cookieName = cookies[i].split('=')[0];
            var cookieValue = cookies[i].split('=')[1];

            if (cookieName === "fantasyPlatform") {
                if (cookieValue === 'espn') {
                    Payment.findOneAndUpdate({
                        leagues: {
                            $elemMatch: {
                                espnLeagueId: req.body.espnLeagueId,
                                espnTeamId: req.body.espnTeamId
                            }
                        }
                    }, {
                            email: req.body.token.email,
                            paymentAmount: req.body.amount,
                            paid: true,
                            paymentDate: new Date(),
                        }, {
                            upsert: true
                        }, function (error, response) {
                        })
                    res.cookie('paid', true);
                } else {
                    var yahooEmail = req.body.yahooEmail;
                    var leagueId = req.body.leagueId;
                    var teamId = req.body.teamId;

                    if (yahooEmail === 'undefined') {
                        Payment.findOneAndUpdate({
                            leagues: {
                                $elemMatch: {
                                    leagueId: leagueId,
                                    teamId: teamId
                                }
                            }
                        }, {
                                email: '',
                                paymentAmount: req.body.amount,
                                yahooEmail: req.body.yahooEmail,
                                paid: true,
                                paymentDate: new Date(),
                            }, {
                                upsert: true
                            }, function (error, response) {
                                console.log(response)
                            })
                    } else {
                        Payment.findOneAndUpdate({
                            yahooEmail: req.body.yahooEmail
                        }, {
                                email: req.body.token.email,
                                paymentAmount: req.body.amount,
                                yahooEmail: req.body.yahooEmail,
                                paid: true,
                                paymentDate: new Date(),
                            }, {
                                upsert: true
                            }, function (error, response) {
                            })
                    }

                    res.cookie('paid', true);
                }
            }
        }

        res.status(200).send({ success: stripeRes });
    }
};

exports.create_espn_user = function (req, res) {
    Payment.findOne({
        leagues: {
            $elemMatch: {
                espnLeagueId: req.params.espnLeagueId,
                espnTeamId: req.params.espnTeamId
            }
        }
    }, function (error, result) {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
            if (!result) {
                Payment.create({
                    leagues: {
                        'espnLeagueId': req.params.espnLeagueId,
                        'espnTeamId': req.params.espnTeamId
                    },
                    'paid': false
                })
                res.cookie('paid', false);
                res.status(200).send({ success: 'creation success' });
            } else {
                res.cookie('paid', result.paid)
                res.status(200).send({ success: 'found success' });
            }
        }
    })
}