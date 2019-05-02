var request = require("request"),
    async = require("async"),
    scraper = require('table-scraper'),
    stats = require("stats-lite"),
    fs = require('fs-then');

var mongoose = require('mongoose'),
    PlayerSeasonData = mongoose.model('PlayerSeasonData'),
    PlayerRecentData = mongoose.model('PlayerRecentData'),
    BBMRankingsRecent = mongoose.model('BBMRankingsRecent'),
    BBMRankingsSeason = mongoose.model('BBMRankingsSeason')

exports.getRankings = function (req, res) {
    var playerRankings = [];
    var playerRankingsRecent = [];
    var mlbSeasonBatters = [];
    var mlbRecentBatters = [];
    var mlbSeasonPitchers = [];

    var gamesSeasonArray = [];
    var hitSeasonArray = [];
    var doubleSeasonArray = [];
    var homeRunSeasonArray = [];
    var runSeasonArray = [];
    var rbiSeasonArray = [];
    var walkSeasonArray = [];
    var sbSeasonArray = [];
    var avgSeasonArray = [];
    var obpSeasonArray = [];
    var slgSeasonArray = [];
    var opsSeasonArray = [];

    var gamesSeasonStDev;
    var hitSeasonStDev;
    var doubleSeasonStDev;
    var homeRunSeasonStDev;
    var runSeasonStDev;
    var rbiSeasonStDev;
    var walkSeasonStDev;
    var sbSeasonStDev;
    var avgSeasonStDev;
    var obpSeasonStDev;
    var slgSeasonStDev;
    var opsSeasonStDev;

    var gamesSeasonAvg;
    var hitSeasonAvg;
    var doubleSeasonAvg;
    var homeRunSeasonAvg;
    var runSeasonAvg;
    var rbiSeasonAvg;
    var walkSeasonAvg;
    var sbSeasonAvg;
    var avgSeasonAvg;
    var obpSeasonAvg;
    var slgSeasonAvg;
    var opsSeasonAvg;

    PlayerSeasonData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
    PlayerRecentData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });

    fs.readFile('./public/json/batterRankingsSeason.json', (err, data) => {

        if (err) throw err;
        let mlbSeasonBattersJSON = JSON.parse(data);

        var gamesSeasonArray = [];
        var hitSeasonArray = [];
        var doubleSeasonArray = [];
        var homeRunSeasonArray = [];
        var runSeasonArray = [];
        var rbiSeasonArray = [];
        var walkSeasonArray = [];
        var sbSeasonArray = [];
        var avgSeasonArray = [];
        var obpSeasonArray = [];
        var slgSeasonArray = [];
        var opsSeasonArray = [];

        for (var i = 0; i < Object.keys(mlbSeasonBattersJSON).length; i++) {
            mlbSeasonBatters.push(mlbSeasonBattersJSON[i])
        }

        async.forEachOf(mlbSeasonBatters, function (value, i, callback) {
            if (mlbSeasonBatters[i].AB > 0) {
                gamesSeasonArray.push(mlbSeasonBatters[i].G);
                hitSeasonArray.push(mlbSeasonBatters[i].H);
                doubleSeasonArray.push(mlbSeasonBatters[i]['2B']);
                homeRunSeasonArray.push(mlbSeasonBatters[i].HR);
                runSeasonArray.push(mlbSeasonBatters[i].R);
                rbiSeasonArray.push(mlbSeasonBatters[i].RBI);
                walkSeasonArray.push(mlbSeasonBatters[i].BB);
                sbSeasonArray.push(mlbSeasonBatters[i].SB);
                avgSeasonArray.push(mlbSeasonBatters[i].AVG);
                obpSeasonArray.push(mlbSeasonBatters[i].OBP);
                slgSeasonArray.push(mlbSeasonBatters[i].SLG);
                opsSeasonArray.push(mlbSeasonBatters[i].OPS);
            }

            callback();
        }, function (err) {

            gamesSeasonStDev = stats.stdev(gamesSeasonArray).toFixed(2);
            hitSeasonStDev = stats.stdev(hitSeasonArray).toFixed(2);
            doubleSeasonStDev = stats.stdev(doubleSeasonArray).toFixed(2);
            homeRunSeasonStDev = stats.stdev(homeRunSeasonArray).toFixed(2);
            runSeasonStDev = stats.stdev(runSeasonArray).toFixed(2);
            rbiSeasonStDev = stats.stdev(rbiSeasonArray).toFixed(2);
            walkSeasonStDev = stats.stdev(walkSeasonArray).toFixed(2);
            sbSeasonStDev = stats.stdev(sbSeasonArray).toFixed(2);
            avgSeasonStDev = stats.stdev(avgSeasonArray).toFixed(2);
            obpSeasonStDev = stats.stdev(obpSeasonArray).toFixed(2);
            slgSeasonStDev = stats.stdev(slgSeasonArray).toFixed(2);
            opsSeasonStDev = (stats.stdev(opsSeasonArray) * 5).toFixed(2);

            gamesSeasonAvg = stats.mean(gamesSeasonArray).toFixed(2);
            hitSeasonAvg = stats.mean(hitSeasonArray).toFixed(2);

            doubleSeasonAvg = stats.mean(doubleSeasonArray).toFixed(2);
            homeRunSeasonAvg = stats.mean(homeRunSeasonArray).toFixed(2);
            runSeasonAvg = stats.mean(runSeasonArray).toFixed(2);
            rbiSeasonAvg = stats.mean(rbiSeasonArray).toFixed(2);
            walkSeasonAvg = stats.mean(walkSeasonArray).toFixed(2);
            sbSeasonAvg = stats.mean(sbSeasonArray).toFixed(2);
            avgSeasonAvg = stats.mean(avgSeasonArray).toFixed(2);
            obpSeasonAvg = stats.mean(obpSeasonArray).toFixed(2);
            slgSeasonAvg = stats.mean(slgSeasonArray).toFixed(2);
            opsSeasonAvg = stats.mean(opsSeasonArray).toFixed(2);

            for (var i = 0; i < mlbSeasonBatters.length; i++) {
                var gamesRating = Number((mlbSeasonBatters[i].G - gamesSeasonAvg) / gamesSeasonStDev).toFixed(2);
                var hitRating = Number((mlbSeasonBatters[i].H - hitSeasonAvg) / hitSeasonStDev).toFixed(2);
                var doubleRating = Number((mlbSeasonBatters[i]['2B'] - doubleSeasonAvg) / doubleSeasonStDev).toFixed(2);
                var homeRunRating = Number((mlbSeasonBatters[i].HR - homeRunSeasonAvg) / homeRunSeasonStDev).toFixed(2);
                var runRating = Number((mlbSeasonBatters[i].R - runSeasonAvg) / runSeasonStDev).toFixed(2);
                var rbiRating = Number((mlbSeasonBatters[i].RBI - rbiSeasonAvg) / rbiSeasonStDev).toFixed(2);
                var walkRating = Number((mlbSeasonBatters[i].BB - walkSeasonAvg) / walkSeasonStDev).toFixed(2);
                var sbRating = Number((mlbSeasonBatters[i].SB - sbSeasonAvg) / sbSeasonStDev).toFixed(2);
                var avgRating = Number((mlbSeasonBatters[i].AVG - avgSeasonAvg) / avgSeasonStDev).toFixed(2);
                var obpRating = Number((mlbSeasonBatters[i].OBP - obpSeasonAvg) / obpSeasonStDev).toFixed(2);
                var slgRating = Number((mlbSeasonBatters[i].SLG - slgSeasonAvg) / slgSeasonStDev).toFixed(2);
                var opsRating = Number((mlbSeasonBatters[i].OPS - opsSeasonAvg) / opsSeasonStDev).toFixed(2);

                var overallRating = ((+hitRating + +doubleRating + +homeRunRating + +runRating + +rbiRating + +sbRating + +avgRating + +obpRating + +slgRating + +opsRating) / 12).toFixed(2);

                mlbSeasonBatters[i].gamesRating = gamesRating;
                mlbSeasonBatters[i].hitRating = hitRating;
                mlbSeasonBatters[i].doubleRating = doubleRating;
                mlbSeasonBatters[i].homeRunRating = homeRunRating;
                mlbSeasonBatters[i].runRating = runRating;
                mlbSeasonBatters[i].rbiRating = rbiRating;
                mlbSeasonBatters[i].walkRating = walkRating;
                mlbSeasonBatters[i].sbRating = sbRating;
                mlbSeasonBatters[i].avgRating = avgRating;
                mlbSeasonBatters[i].obpRating = obpRating;
                mlbSeasonBatters[i].slgRating = slgRating;
                mlbSeasonBatters[i].opsRating = opsRating;
                mlbSeasonBatters[i].overallRating = overallRating;
            }
        })
    }).then(function (data) {
        async.parallel({
            one: function (callback) {

                playerRank = 1;

                mlbSeasonBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                for (var i = 0; i < mlbSeasonBatters.length; i++) {
                    if (mlbSeasonBatters[i].AB > 0) {
                        PlayerSeasonData.create({
                            playerId: mlbSeasonBatters[i].index,
                            playerName: mlbSeasonBatters[i].Name,
                            playerType: "Batter",
                            team: mlbSeasonBatters[i].Team,
                            games: mlbSeasonBatters[i].G,
                            hit: mlbSeasonBatters[i].H,
                            double: mlbSeasonBatters[i]['2B'],
                            homeRun: mlbSeasonBatters[i].HR,
                            run: mlbSeasonBatters[i].R,
                            rbi: mlbSeasonBatters[i].RBI,
                            walk: mlbSeasonBatters[i].BB,
                            sb: mlbSeasonBatters[i].SB,
                            avg: mlbSeasonBatters[i].AVG,
                            obp: mlbSeasonBatters[i].OBP,
                            slg: mlbSeasonBatters[i].SLG,
                            ops: mlbSeasonBatters[i].OPS,
                            gamesRating: mlbSeasonBatters[i].gamesRating,
                            hitRating: mlbSeasonBatters[i].hitRating,
                            doubleRating: mlbSeasonBatters[i].doubleRating,
                            homeRunRating: mlbSeasonBatters[i].homeRunRating,
                            runRating: mlbSeasonBatters[i].runRating,
                            rbiRating: mlbSeasonBatters[i].rbiRating,
                            walkRating: mlbSeasonBatters[i].walkRating,
                            sbRating: mlbSeasonBatters[i].sbRating,
                            avgRating: mlbSeasonBatters[i].avgRating,
                            obpRating: mlbSeasonBatters[i].obpRating,
                            slgRating: mlbSeasonBatters[i].slgRating,
                            opsRating: mlbSeasonBatters[i].opsRating,

                            win: 0,
                            era: 0,
                            whip: 0,
                            ip: 0,
                            sv: 0,
                            k: 0,
                            hold: 0,
                            savehold: 0,
                            k9: 0,
                            gamesRating: 0,
                            winRating: 0,
                            eraRating: 0,
                            whipRating: 0,
                            ipRating: 0,
                            svRating: 0,
                            kRating: 0,
                            holdRating: 0,
                            saveholdRating: 0,
                            k9Rating: 0,

                            overallRating: mlbSeasonBatters[i].overallRating,
                            overallRank: playerRank
                        });
                        playerRank++
                    }
                }
                callback()
            },
            two: function (callback) {
                // mlbRecentBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                // playerRank = 1;

                // for (var i = 0; i < mlbRecentBatters.length; i++) {
                //     if (mlbRecentBatters[i].gpRank < 350) {
                //         PlayerRecentData.create({
                //             playerId: mlbRecentBatters[i].playerId,
                //             playerName: mlbRecentBatters[i].playerName,
                //             teamId: mlbRecentBatters[i].teamId,
                //             teamAbbreviation: mlbRecentBatters[i].teamAbbreviation,
                //             min: mlbRecentBatters[i].min,
                //             fgPct: mlbRecentBatters[i].fgPct,
                //             ftPct: mlbRecentBatters[i].ftPct,
                //             fG3M: mlbRecentBatters[i].fG3M,
                //             reb: mlbRecentBatters[i].reb,
                //             ast: mlbRecentBatters[i].ast,
                //             tov: mlbRecentBatters[i].tov,
                //             stl: mlbRecentBatters[i].stl,
                //             blk: mlbRecentBatters[i].blk,
                //             pts: mlbRecentBatters[i].pts,
                //             fta: mlbRecentBatters[i].fta,
                //             fga: mlbRecentBatters[i].fga,
                //             ftRating: mlbRecentBatters[i].ftRating,
                //             fgRating: mlbRecentBatters[i].fgRating,
                //             ptsRating: mlbRecentBatters[i].ptsRating,
                //             threeRating: mlbRecentBatters[i].threeRating,
                //             rebRating: mlbRecentBatters[i].rebRating,
                //             astRating: mlbRecentBatters[i].astRating,
                //             stlRating: mlbRecentBatters[i].stlRating,
                //             blkRating: mlbRecentBatters[i].blkRating,
                //             toRating: mlbRecentBatters[i].toRating,
                //             ftaRating: mlbRecentBatters[i].ftaRating,
                //             fgaRating: mlbRecentBatters[i].fgaRating,
                //             ftMixedRating: mlbRecentBatters[i].ftMixedRating,
                //             fgMixedRating: mlbRecentBatters[i].fgMixedRating,
                //             overallRating: mlbRecentBatters[i].overallRating,
                //             overallRank: playerRank
                //         });
                //         playerRank++
                //     }

                // }
                callback()
            }
        }, function (err, results) {
            //Here put the creation of the standard deviations and stuff and making the rankings prob
            PlayerSeasonData.find({}, function (err, players) {
                if (err) {
                    res.send(err);
                }
            });
        });
    })

    fs.readFile('./public/json/pitcherRankingsSeason.json', (err, data) => {
        if (err) throw err;
        let mlbSeasonPitchersJSON = JSON.parse(data);

        var gamesSeasonArray = [];
        var winSeasonArray = [];
        var eraSeasonArray = [];
        var whipRunSeasonArray = [];
        var ipSeasonArray = [];
        var saveSeasonArray = [];
        var kSeasonArray = [];
        // var qsSeasonArray = [];
        var holdSeasonArray = [];
        var saveholdSeasonArray = [];
        var k9SeasonArray = [];

        var gamesSeasonStDev;
        var winSeasonStDev;
        var eraSeasonStDev;
        var whipSeasonStDev;
        var ipSeasonStDev;
        var saveSeasonStDev;
        var kSeasonStDev;
        var holdSeasonStDev;
        var saveholdSeasonStDev;
        var k9SeasonStDev;

        var gamesSeasonAvg;
        var winSeasonAvg;
        var eraSeasonAvg;
        var whipSeasonAvg;
        var ipSeasonAvg;
        var saveSeasonAvg;
        var kSeasonAvg;
        var holdSeasonAvg;
        var saveholdSeasonAvg;
        var k9SeasonAvg;

        for (var i = 0; i < Object.keys(mlbSeasonPitchersJSON).length; i++) {
            mlbSeasonPitchers.push(mlbSeasonPitchersJSON[i])
        }

        async.forEachOf(mlbSeasonPitchers, function (value, i, callback) {
            if (mlbSeasonPitchers[i].IP > 0) {
                gamesSeasonArray.push(mlbSeasonPitchers[i].G);
                winSeasonArray.push(mlbSeasonPitchers[i].W);
                eraSeasonArray.push(mlbSeasonPitchers[i].ERA);
                whipRunSeasonArray.push(mlbSeasonPitchers[i].WHIP);
                ipSeasonArray.push(mlbSeasonPitchers[i].IP);
                saveSeasonArray.push(mlbSeasonPitchers[i].SV);
                kSeasonArray.push(mlbSeasonPitchers[i].SO);
                // qsSeasonArray.push(mlbSeasonBatters[i].QS);
                holdSeasonArray.push(mlbSeasonPitchers[i].HLD);
                saveholdSeasonArray.push(Number(mlbSeasonPitchers[i].SV + mlbSeasonPitchers[i].HLD));
                k9SeasonArray.push(mlbSeasonPitchers[i]["K/9"]);
            }

            callback();
        }, function (err) {

            gamesSeasonStDev = stats.stdev(gamesSeasonArray).toFixed(2);
            winSeasonStDev = stats.stdev(winSeasonArray).toFixed(2);
            eraSeasonStDev = stats.stdev(eraSeasonArray).toFixed(2);
            whipSeasonStDev = stats.stdev(whipRunSeasonArray).toFixed(2);
            ipSeasonStDev = stats.stdev(ipSeasonArray).toFixed(2);
            saveSeasonStDev = stats.stdev(saveSeasonArray).toFixed(2);
            kSeasonStDev = stats.stdev(kSeasonArray).toFixed(2);
            holdSeasonStDev = stats.stdev(holdSeasonArray).toFixed(2);
            saveholdSeasonStDev = stats.stdev(saveholdSeasonArray).toFixed(2);
            k9SeasonStDev = stats.stdev(k9SeasonArray).toFixed(2);

            gamesSeasonAvg = stats.mean(gamesSeasonArray).toFixed(2);
            winSeasonAvg = stats.mean(winSeasonArray).toFixed(2);
            eraSeasonAvg = stats.mean(eraSeasonArray).toFixed(2);
            whipSeasonAvg = stats.mean(whipRunSeasonArray).toFixed(2);
            ipSeasonAvg = stats.mean(ipSeasonArray).toFixed(2);
            saveSeasonAvg = stats.mean(saveSeasonArray).toFixed(2);
            kSeasonAvg = stats.mean(kSeasonArray).toFixed(2);
            holdSeasonAvg = stats.mean(holdSeasonArray).toFixed(2);
            saveholdSeasonAvg = stats.mean(saveholdSeasonArray).toFixed(2);
            k9SeasonAvg = stats.mean(k9SeasonArray).toFixed(2);

            for (var i = 0; i < mlbSeasonPitchers.length; i++) {
                var gamesRating = Number((mlbSeasonPitchers[i].G - gamesSeasonAvg) / gamesSeasonStDev).toFixed(2);
                var winRating = Number((mlbSeasonPitchers[i].W - winSeasonAvg) / winSeasonStDev).toFixed(2);
                var eraRating = Number((eraSeasonAvg - mlbSeasonPitchers[i].ERA) / eraSeasonStDev).toFixed(2);
                var whipRating = Number((whipSeasonAvg - mlbSeasonPitchers[i].WHIP) / whipSeasonStDev).toFixed(2);
                var ipRating = Number((mlbSeasonPitchers[i].IP - ipSeasonAvg) / ipSeasonStDev).toFixed(2);
                var svRating = Number((mlbSeasonPitchers[i].SV - saveSeasonAvg) / (saveSeasonStDev * 2)).toFixed(2);
                var kRating = Number((mlbSeasonPitchers[i].SO - kSeasonAvg) / kSeasonStDev).toFixed(2);
                var holdRating = Number((mlbSeasonPitchers[i].HLD - holdSeasonAvg) / (holdSeasonStDev * 2)).toFixed(2);
                var saveholdRating = Number((Number(mlbSeasonPitchers[i].SV + mlbSeasonPitchers[i].HLD) - saveholdSeasonAvg) / (saveholdSeasonStDev * 2)).toFixed(2);
                var k9Rating = Number((mlbSeasonPitchers[i]["K/9"] - k9SeasonAvg) / k9SeasonStDev).toFixed(2);

                var overallRating = ((+winRating + +eraRating + +whipRating + +ipRating + +svRating + +kRating + +holdRating + +saveholdRating + +k9Rating + +svRating) / 9).toFixed(2);

                mlbSeasonPitchers[i].gamesRating = gamesRating;
                mlbSeasonPitchers[i].winRating = winRating;
                mlbSeasonPitchers[i].eraRating = eraRating;
                mlbSeasonPitchers[i].whipRating = whipRating;
                mlbSeasonPitchers[i].ipRating = ipRating;
                mlbSeasonPitchers[i].svRating = svRating;
                mlbSeasonPitchers[i].kRating = kRating;
                mlbSeasonPitchers[i].holdRating = holdRating;
                mlbSeasonPitchers[i].saveholdRating = saveholdRating;
                mlbSeasonPitchers[i].k9Rating = k9Rating;
                mlbSeasonPitchers[i].overallRating = overallRating;
            }
        })
    }).then(function (data) {
        async.parallel({
            one: function (callback) {

                playerRank = 1;

                mlbSeasonPitchers.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                for (var i = 0; i < mlbSeasonPitchers.length; i++) {
                    if (mlbSeasonPitchers[i].IP > 0) {
                        PlayerSeasonData.create({
                            playerId: mlbSeasonPitchers[i].index,
                            playerName: mlbSeasonPitchers[i].Name,
                            playerType: "Pitcher",
                            team: mlbSeasonPitchers[i].Team,
                            games: mlbSeasonPitchers[i].G,
                            win: mlbSeasonPitchers[i].W,
                            era: mlbSeasonPitchers[i].ERA,
                            whip: mlbSeasonPitchers[i].WHIP,
                            ip: mlbSeasonPitchers[i].IP,
                            sv: mlbSeasonPitchers[i].SV,
                            k: mlbSeasonPitchers[i].SO,
                            hold: mlbSeasonPitchers[i].HLD,
                            savehold: Number(mlbSeasonPitchers[i].SV + mlbSeasonPitchers[i].HLD),
                            k9: mlbSeasonPitchers[i]["K/9"],
                            gamesRating: mlbSeasonPitchers[i].gamesRating,
                            winRating: mlbSeasonPitchers[i].winRating,
                            eraRating: mlbSeasonPitchers[i].eraRating,
                            whipRating: mlbSeasonPitchers[i].whipRating,
                            ipRating: mlbSeasonPitchers[i].ipRating,
                            svRating: mlbSeasonPitchers[i].svRating,
                            kRating: mlbSeasonPitchers[i].kRating,
                            holdRating: mlbSeasonPitchers[i].holdRating,
                            saveholdRating: mlbSeasonPitchers[i].saveholdRating,
                            k9Rating: mlbSeasonPitchers[i].k9Rating,

                            hit: 0,
                            double: 0,
                            homeRun: 0,
                            run: 0,
                            rbi: 0,
                            walk: 0,
                            sb: 0,
                            avg: 0,
                            obp: 0,
                            slg: 0,
                            ops: 0,
                            gamesRating: 0,
                            hitRating: 0,
                            doubleRating: 0,
                            homeRunRating: 0,
                            runRating: 0,
                            rbiRating: 0,
                            walkRating: 0,
                            sbRating: 0,
                            avgRating: 0,
                            obpRating: 0,
                            slgRating: 0,
                            opsRating: 0,

                            overallRating: mlbSeasonPitchers[i].overallRating,
                            overallRank: playerRank
                        });
                        playerRank++
                    }
                }
                callback()
            },
            two: function (callback) {
                // mlbRecentBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                // playerRank = 1;

                // for (var i = 0; i < mlbRecentBatters.length; i++) {
                //     if (mlbRecentBatters[i].gpRank < 350) {
                //         PlayerRecentData.create({
                //             playerId: mlbRecentBatters[i].playerId,
                //             playerName: mlbRecentBatters[i].playerName,
                //             teamId: mlbRecentBatters[i].teamId,
                //             teamAbbreviation: mlbRecentBatters[i].teamAbbreviation,
                //             min: mlbRecentBatters[i].min,
                //             fgPct: mlbRecentBatters[i].fgPct,
                //             ftPct: mlbRecentBatters[i].ftPct,
                //             fG3M: mlbRecentBatters[i].fG3M,
                //             reb: mlbRecentBatters[i].reb,
                //             ast: mlbRecentBatters[i].ast,
                //             tov: mlbRecentBatters[i].tov,
                //             stl: mlbRecentBatters[i].stl,
                //             blk: mlbRecentBatters[i].blk,
                //             pts: mlbRecentBatters[i].pts,
                //             fta: mlbRecentBatters[i].fta,
                //             fga: mlbRecentBatters[i].fga,
                //             ftRating: mlbRecentBatters[i].ftRating,
                //             fgRating: mlbRecentBatters[i].fgRating,
                //             ptsRating: mlbRecentBatters[i].ptsRating,
                //             threeRating: mlbRecentBatters[i].threeRating,
                //             rebRating: mlbRecentBatters[i].rebRating,
                //             astRating: mlbRecentBatters[i].astRating,
                //             stlRating: mlbRecentBatters[i].stlRating,
                //             blkRating: mlbRecentBatters[i].blkRating,
                //             toRating: mlbRecentBatters[i].toRating,
                //             ftaRating: mlbRecentBatters[i].ftaRating,
                //             fgaRating: mlbRecentBatters[i].fgaRating,
                //             ftMixedRating: mlbRecentBatters[i].ftMixedRating,
                //             fgMixedRating: mlbRecentBatters[i].fgMixedRating,
                //             overallRating: mlbRecentBatters[i].overallRating,
                //             overallRank: playerRank
                //         });
                //         playerRank++
                //     }

                // }
                callback()
            }
        }, function (err, results) {
            //Here put the creation of the standard deviations and stuff and making the rankings prob
            PlayerSeasonData.find({}, function (err, players) {
                if (err) {
                    res.send(err);
                }
            });
        });
    })

    fs.readFile('./public/json/batterRankingsRecent.json', (err, data) => {

        if (err) throw err;
        let mlbRecentBattersJSON = JSON.parse(data);

        var gamesRecentArray = [];
        var hitRecentArray = [];
        var doubleRecentArray = [];
        var homeRunRecentArray = [];
        var runRecentArray = [];
        var rbiRecentArray = [];
        var walkRecentArray = [];
        var sbRecentArray = [];
        var avgRecentArray = [];
        var obpRecentArray = [];
        var slgRecentArray = [];
        var opsRecentArray = [];

        for (var i = 0; i < Object.keys(mlbRecentBattersJSON).length; i++) {
            mlbRecentBatters.push(mlbRecentBattersJSON[i])
        }

        async.forEachOf(mlbRecentBatters, function (value, i, callback) {
            if (mlbRecentBatters[i].AB > 0) {
                gamesRecentArray.push(mlbRecentBatters[i].G);
                hitRecentArray.push(mlbRecentBatters[i].H);
                doubleRecentArray.push(mlbRecentBatters[i]['2B']);
                homeRunRecentArray.push(mlbRecentBatters[i].HR);
                runRecentArray.push(mlbRecentBatters[i].R);
                rbiRecentArray.push(mlbRecentBatters[i].RBI);
                walkRecentArray.push(mlbRecentBatters[i].BB);
                sbRecentArray.push(mlbRecentBatters[i].SB);
                avgRecentArray.push(mlbRecentBatters[i].BA);
                obpRecentArray.push(mlbRecentBatters[i].OBP);
                slgRecentArray.push(mlbRecentBatters[i].SLG);
                opsRecentArray.push(mlbRecentBatters[i].OPS);
            }

            callback();
        }, function (err) {

            gamesRecentStDev = stats.stdev(gamesRecentArray).toFixed(2);
            hitRecentStDev = stats.stdev(hitRecentArray).toFixed(2);
            doubleRecentStDev = stats.stdev(doubleRecentArray).toFixed(2);
            homeRunRecentStDev = stats.stdev(homeRunRecentArray).toFixed(2);
            runRecentStDev = stats.stdev(runRecentArray).toFixed(2);
            rbiRecentStDev = stats.stdev(rbiRecentArray).toFixed(2);
            walkRecentStDev = stats.stdev(walkRecentArray).toFixed(2);
            sbRecentStDev = stats.stdev(sbRecentArray).toFixed(2);
            avgRecentStDev = stats.stdev(avgRecentArray).toFixed(2);
            obpRecentStDev = stats.stdev(obpRecentArray).toFixed(2);
            slgRecentStDev = stats.stdev(slgRecentArray).toFixed(2);
            opsRecentStDev = (stats.stdev(opsRecentArray) * 5).toFixed(2);

            gamesRecentAvg = stats.mean(gamesRecentArray).toFixed(2);
            hitRecentAvg = stats.mean(hitRecentArray).toFixed(2);

            doubleRecentAvg = stats.mean(doubleRecentArray).toFixed(2);
            homeRunRecentAvg = stats.mean(homeRunRecentArray).toFixed(2);
            runRecentAvg = stats.mean(runRecentArray).toFixed(2);
            rbiRecentAvg = stats.mean(rbiRecentArray).toFixed(2);
            walkRecentAvg = stats.mean(walkRecentArray).toFixed(2);
            sbRecentAvg = stats.mean(sbRecentArray).toFixed(2);
            avgRecentAvg = stats.mean(avgRecentArray).toFixed(2);
            obpRecentAvg = stats.mean(obpRecentArray).toFixed(2);
            slgRecentAvg = stats.mean(slgRecentArray).toFixed(2);
            opsRecentAvg = stats.mean(opsRecentArray).toFixed(2);

            for (var i = 0; i < mlbRecentBatters.length; i++) {
                var gamesRating = Number((mlbRecentBatters[i].G - gamesRecentAvg) / gamesRecentStDev).toFixed(2);
                var hitRating = Number((mlbRecentBatters[i].H - hitRecentAvg) / hitRecentStDev).toFixed(2);
                var doubleRating = Number((mlbRecentBatters[i]['2B'] - doubleRecentAvg) / doubleRecentStDev).toFixed(2);
                var homeRunRating = Number((mlbRecentBatters[i].HR - homeRunRecentAvg) / homeRunRecentStDev).toFixed(2);
                var runRating = Number((mlbRecentBatters[i].R - runRecentAvg) / runRecentStDev).toFixed(2);
                var rbiRating = Number((mlbRecentBatters[i].RBI - rbiRecentAvg) / rbiRecentStDev).toFixed(2);
                var walkRating = Number((mlbRecentBatters[i].BB - walkRecentAvg) / walkRecentStDev).toFixed(2);
                var sbRating = Number((mlbRecentBatters[i].SB - sbRecentAvg) / sbRecentStDev).toFixed(2);
                var avgRating = Number((mlbRecentBatters[i].BA - avgRecentAvg) / avgRecentStDev).toFixed(2);
                var obpRating = Number((mlbRecentBatters[i].OBP - obpRecentAvg) / obpRecentStDev).toFixed(2);
                var slgRating = Number((mlbRecentBatters[i].SLG - slgRecentAvg) / slgRecentStDev).toFixed(2);
                var opsRating = Number((mlbRecentBatters[i].OPS - opsRecentAvg) / opsRecentStDev).toFixed(2);

                var overallRating = ((+hitRating + +doubleRating + +homeRunRating + +runRating + +rbiRating + +sbRating + +avgRating + +obpRating + +slgRating + +opsRating) / 12).toFixed(2);

                mlbRecentBatters[i].gamesRating = gamesRating;
                mlbRecentBatters[i].hitRating = hitRating;
                mlbRecentBatters[i].doubleRating = doubleRating;
                mlbRecentBatters[i].homeRunRating = homeRunRating;
                mlbRecentBatters[i].runRating = runRating;
                mlbRecentBatters[i].rbiRating = rbiRating;
                mlbRecentBatters[i].walkRating = walkRating;
                mlbRecentBatters[i].sbRating = sbRating;
                mlbRecentBatters[i].avgRating = avgRating;
                mlbRecentBatters[i].obpRating = obpRating;
                mlbRecentBatters[i].slgRating = slgRating;
                mlbRecentBatters[i].opsRating = opsRating;
                mlbRecentBatters[i].overallRating = overallRating;
            }
        })
    }).then(function (data) {

        playerRank = 1;

        mlbRecentBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

        for (var i = 0; i < mlbRecentBatters.length; i++) {
            if (mlbRecentBatters[i].AB > 0) {
                PlayerRecentData.create({
                    playerId: mlbRecentBatters[i].index,
                    playerName: mlbRecentBatters[i].Name,
                    playerType: "Batter",
                    team: mlbRecentBatters[i].Team,
                    games: mlbRecentBatters[i].G,
                    hit: mlbRecentBatters[i].H,
                    double: mlbRecentBatters[i]['2B'],
                    homeRun: mlbRecentBatters[i].HR,
                    run: mlbRecentBatters[i].R,
                    rbi: mlbRecentBatters[i].RBI,
                    walk: mlbRecentBatters[i].BB,
                    sb: mlbRecentBatters[i].SB,
                    avg: mlbRecentBatters[i].AVG,
                    obp: mlbRecentBatters[i].OBP,
                    slg: mlbRecentBatters[i].SLG,
                    ops: mlbRecentBatters[i].OPS,
                    gamesRating: mlbRecentBatters[i].gamesRating,
                    hitRating: mlbRecentBatters[i].hitRating,
                    doubleRating: mlbRecentBatters[i].doubleRating,
                    homeRunRating: mlbRecentBatters[i].homeRunRating,
                    runRating: mlbRecentBatters[i].runRating,
                    rbiRating: mlbRecentBatters[i].rbiRating,
                    walkRating: mlbRecentBatters[i].walkRating,
                    sbRating: mlbRecentBatters[i].sbRating,
                    avgRating: mlbRecentBatters[i].avgRating,
                    obpRating: mlbRecentBatters[i].obpRating,
                    slgRating: mlbRecentBatters[i].slgRating,
                    opsRating: mlbRecentBatters[i].opsRating,

                    win: 0,
                    era: 0,
                    whip: 0,
                    ip: 0,
                    sv: 0,
                    k: 0,
                    hold: 0,
                    savehold: 0,
                    k9: 0,
                    gamesRating: 0,
                    winRating: 0,
                    eraRating: 0,
                    whipRating: 0,
                    ipRating: 0,
                    svRating: 0,
                    kRating: 0,
                    holdRating: 0,
                    saveholdRating: 0,
                    k9Rating: 0,

                    overallRating: mlbRecentBatters[i].overallRating,
                    overallRank: playerRank
                });
                playerRank++
            }
        }
    }, function (err, results) {
        //Here put the creation of the standard deviations and stuff and making the rankings prob
        PlayerRecentData.find({}, function (err, players) {
            if (err) {
                res.send(err);
            }
        });
    });

    fs.readFile('./public/json/pitcherRankingsRecent.json', (err, data) => {
        if (err) throw err;
        let mlbRecentPitchersJSON = JSON.parse(data);
        var mlbRecentPitchers = [];
        
        var gamesRecentArray = [];
        var winRecentArray = [];
        var eraRecentArray = [];
        var whipRunRecentArray = [];
        var ipRecentArray = [];
        var saveRecentArray = [];
        var kRecentArray = [];
        // var qsRecentArray = [];
        var holdRecentArray = [];
        var saveholdRecentArray = [];
        var k9RecentArray = [];

        var gamesRecentStDev;
        var winRecentStDev;
        var eraRecentStDev;
        var whipRecentStDev;
        var ipRecentStDev;
        var saveRecentStDev;
        var kRecentStDev;
        var holdRecentStDev;
        var saveholdRecentStDev;
        var k9RecentStDev;

        var gamesRecentAvg;
        var winRecentAvg;
        var eraRecentAvg;
        var whipRecentAvg;
        var ipRecentAvg;
        var saveRecentAvg;
        var kRecentAvg;
        var holdRecentAvg;
        var saveholdRecentAvg;
        var k9RecentAvg;

        for (var i = 0; i < Object.keys(mlbRecentPitchersJSON).length; i++) {
            mlbRecentPitchers.push(mlbRecentPitchersJSON[i])
        }

        async.forEachOf(mlbRecentPitchers, function (value, i, callback) {
            if (mlbRecentPitchers[i].IP > 0) {
                gamesRecentArray.push(mlbRecentPitchers[i].G);
                winRecentArray.push(mlbRecentPitchers[i].W);
                eraRecentArray.push(mlbRecentPitchers[i].ERA);
                whipRunRecentArray.push(mlbRecentPitchers[i].WHIP);
                ipRecentArray.push(mlbRecentPitchers[i].IP);
                saveRecentArray.push(mlbRecentPitchers[i].SV);
                kRecentArray.push(mlbRecentPitchers[i].SO);
                // qsRecentArray.push(mlbRecentBatters[i].QS);
                holdRecentArray.push(mlbRecentPitchers[i].HLD);
                saveholdRecentArray.push(Number(mlbRecentPitchers[i].SV + mlbRecentPitchers[i].HLD));
                k9RecentArray.push(mlbRecentPitchers[i]["K/9"]);
            }

            callback();
        }, function (err) {

            gamesRecentStDev = stats.stdev(gamesRecentArray).toFixed(2);
            winRecentStDev = stats.stdev(winRecentArray).toFixed(2);
            eraRecentStDev = stats.stdev(eraRecentArray).toFixed(2);
            whipRecentStDev = stats.stdev(whipRunRecentArray).toFixed(2);
            ipRecentStDev = stats.stdev(ipRecentArray).toFixed(2);
            saveRecentStDev = stats.stdev(saveRecentArray).toFixed(2);
            kRecentStDev = stats.stdev(kRecentArray).toFixed(2);
            holdRecentStDev = stats.stdev(holdRecentArray).toFixed(2);
            saveholdRecentStDev = stats.stdev(saveholdRecentArray).toFixed(2);
            k9RecentStDev = stats.stdev(k9RecentArray).toFixed(2);

            gamesRecentAvg = stats.mean(gamesRecentArray).toFixed(2);
            winRecentAvg = stats.mean(winRecentArray).toFixed(2);
            eraRecentAvg = stats.mean(eraRecentArray).toFixed(2);
            whipRecentAvg = stats.mean(whipRunRecentArray).toFixed(2);
            ipRecentAvg = stats.mean(ipRecentArray).toFixed(2);
            saveRecentAvg = stats.mean(saveRecentArray).toFixed(2);
            kRecentAvg = stats.mean(kRecentArray).toFixed(2);
            holdRecentAvg = stats.mean(holdRecentArray).toFixed(2);
            saveholdRecentAvg = stats.mean(saveholdRecentArray).toFixed(2);
            k9RecentAvg = stats.mean(k9RecentArray).toFixed(2);

            for (var i = 0; i < mlbRecentPitchers.length; i++) {
                var gamesRating = Number((mlbRecentPitchers[i].G - gamesRecentAvg) / gamesRecentStDev).toFixed(2);
                var winRating = Number((mlbRecentPitchers[i].W - winRecentAvg) / winRecentStDev).toFixed(2);
                var eraRating = Number((eraRecentAvg - mlbRecentPitchers[i].ERA) / eraRecentStDev).toFixed(2);
                var whipRating = Number((whipRecentAvg - mlbRecentPitchers[i].WHIP) / whipRecentStDev).toFixed(2);
                var ipRating = Number((mlbRecentPitchers[i].IP - ipRecentAvg) / ipRecentStDev).toFixed(2);
                var svRating = Number((mlbRecentPitchers[i].SV - saveRecentAvg) / (saveRecentStDev * 2)).toFixed(2);
                var kRating = Number((mlbRecentPitchers[i].SO - kRecentAvg) / kRecentStDev).toFixed(2);
                var holdRating = Number((mlbRecentPitchers[i].HLD - holdRecentAvg) / (holdRecentStDev * 2)).toFixed(2);
                var saveholdRating = Number((Number(mlbRecentPitchers[i].SV + mlbRecentPitchers[i].HLD) - saveholdRecentAvg) / (saveholdRecentStDev * 2)).toFixed(2);
                var k9Rating = Number((mlbRecentPitchers[i]["K/9"] - k9RecentAvg) / k9RecentStDev).toFixed(2);

                var overallRating = ((+winRating + +eraRating + +whipRating + +ipRating + +svRating + +kRating + +holdRating + +saveholdRating + +k9Rating + +svRating) / 9).toFixed(2);

                mlbRecentPitchers[i].gamesRating = gamesRating;
                mlbRecentPitchers[i].winRating = winRating;
                mlbRecentPitchers[i].eraRating = eraRating;
                mlbRecentPitchers[i].whipRating = whipRating;
                mlbRecentPitchers[i].ipRating = ipRating;
                mlbRecentPitchers[i].svRating = svRating;
                mlbRecentPitchers[i].kRating = kRating;
                mlbRecentPitchers[i].holdRating = holdRating;
                mlbRecentPitchers[i].saveholdRating = saveholdRating;
                mlbRecentPitchers[i].k9Rating = k9Rating;
                mlbRecentPitchers[i].overallRating = overallRating;
            }
        })
    }).then(function (data) {
        async.parallel({
            one: function (callback) {

                playerRank = 1;

                mlbRecentPitchers.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                for (var i = 0; i < mlbRecentPitchers.length; i++) {
                    if (mlbRecentPitchers[i].IP > 0) {
                        PlayerRecentData.create({
                            playerId: mlbRecentPitchers[i].index,
                            playerName: mlbRecentPitchers[i].Name,
                            playerType: "Pitcher",
                            team: mlbRecentPitchers[i].Team,
                            games: mlbRecentPitchers[i].G,
                            win: mlbRecentPitchers[i].W,
                            era: mlbRecentPitchers[i].ERA,
                            whip: mlbRecentPitchers[i].WHIP,
                            ip: mlbRecentPitchers[i].IP,
                            sv: mlbRecentPitchers[i].SV,
                            k: mlbRecentPitchers[i].SO,
                            hold: mlbRecentPitchers[i].HLD,
                            savehold: Number(mlbRecentPitchers[i].SV + mlbRecentPitchers[i].HLD),
                            k9: mlbRecentPitchers[i]["K/9"],
                            gamesRating: mlbRecentPitchers[i].gamesRating,
                            winRating: mlbRecentPitchers[i].winRating,
                            eraRating: mlbRecentPitchers[i].eraRating,
                            whipRating: mlbRecentPitchers[i].whipRating,
                            ipRating: mlbRecentPitchers[i].ipRating,
                            svRating: mlbRecentPitchers[i].svRating,
                            kRating: mlbRecentPitchers[i].kRating,
                            holdRating: mlbRecentPitchers[i].holdRating,
                            saveholdRating: mlbRecentPitchers[i].saveholdRating,
                            k9Rating: mlbRecentPitchers[i].k9Rating,

                            hit: 0,
                            double: 0,
                            homeRun: 0,
                            run: 0,
                            rbi: 0,
                            walk: 0,
                            sb: 0,
                            avg: 0,
                            obp: 0,
                            slg: 0,
                            ops: 0,
                            gamesRating: 0,
                            hitRating: 0,
                            doubleRating: 0,
                            homeRunRating: 0,
                            runRating: 0,
                            rbiRating: 0,
                            walkRating: 0,
                            sbRating: 0,
                            avgRating: 0,
                            obpRating: 0,
                            slgRating: 0,
                            opsRating: 0,

                            overallRating: mlbRecentPitchers[i].overallRating,
                            overallRank: playerRank
                        });
                        playerRank++
                    }
                }
                callback()
            }
        }, function (err, results) {
            //Here put the creation of the standard deviations and stuff and making the rankings prob
            PlayerRecentData.find({}, function (err, players) {
                if (err) {
                    res.send(err);
                }
            });
        });
    })
}

exports.getBBMRankings = function () {
    //     var playerRankings = [];
    //     var playerRankingsTwoWeeks = [];
    //     var todayFullDate = new Date();
    //     var todayDate = ("0" + (todayFullDate.getMonth() + 1)).slice(-2);
    //     var twoWeeksFullDate = new Date(+new Date - 12096e5)
    //     var twoWeeksDate = ("0" + (twoWeeksFullDate.getMonth() + 1)).slice(-2);
    //     var seasonStartYear;
    //     todayDate = todayDate + ("0" + todayFullDate.getDate()).slice(-2);
    //     todayDate = todayDate + todayFullDate.getUTCFullYear();
    //     twoWeeksDate = twoWeeksDate + ("0" + twoWeeksFullDate.getDate()).slice(-2);;
    //     twoWeeksDate = twoWeeksDate + twoWeeksFullDate.getUTCFullYear();

    //     //If it is before july, then teh season start date should be the year before
    //     if (todayFullDate.getMonth() < 7) {
    //         seasonStartYear = todayFullDate.getUTCFullYear() - 1;
    //     } else {
    //         seasonStartYear = todayFullDate.getUTCFullYear();
    //     }

    //     BBMRankingsSeason.remove({}, function (err, task) {
    //         if (err)
    //             res.send(err);
    //     });
    //     BBMRankingsRecent.remove({}, function (err, task) {
    //         if (err)
    //             res.send(err);
    //     });

    //     //Get rankings for season
    //     scraper.get('https://baseballmonster.com/playerrankings.aspx?start=0701' + seasonStartYear + '&end=' + todayDate)
    //         .then(function (tableData) {
    //             tableData = tableData[0];
    //             async.forEachOf(tableData, function (value, i, callback) {

    //                 var tableHeaderNumber = Object.getOwnPropertyNames(tableData[0])[0];
    //                 tableHeaderNumber = tableHeaderNumber.split('_')[1]

    //                 BBMRankingsSeason.create({
    //                     'overallRank': tableData[i]['Rank_' + tableHeaderNumber],
    //                     'overallRating': tableData[i]['Value_' + tableHeaderNumber],
    //                     'playerName': tableData[i]['Name_' + tableHeaderNumber],
    //                     'ptsRating': tableData[i]['pV_' + tableHeaderNumber],
    //                     'threeRating': tableData[i]['3V_' + tableHeaderNumber],
    //                     'rebRating': tableData[i]['rV_' + tableHeaderNumber],
    //                     'astRating': tableData[i]['aV_' + tableHeaderNumber],
    //                     'stlRating': tableData[i]['sV_' + tableHeaderNumber],
    //                     'blkRating': tableData[i]['bV_' + tableHeaderNumber],
    //                     'fgMixedRating': tableData[i]['fg%V_' + tableHeaderNumber],
    //                     'ftMixedRating': tableData[i]['ft%V_' + tableHeaderNumber],
    //                     'toRating': tableData[i]['toV_' + tableHeaderNumber],
    //                     'fgPct': tableData[i]['fg%_' + tableHeaderNumber],
    //                     'ftPct': tableData[i]['ft%_' + tableHeaderNumber],
    //                     'fG3M': tableData[i]['3/g_' + tableHeaderNumber],
    //                     'reb': tableData[i]['r/g_' + tableHeaderNumber],
    //                     'ast': tableData[i]['a/g_' + tableHeaderNumber],
    //                     'tov': tableData[i]['to/g_' + tableHeaderNumber],
    //                     'stl': tableData[i]['s/g_' + tableHeaderNumber],
    //                     'blk': tableData[i]['b/g_' + tableHeaderNumber],
    //                     'pts': tableData[i]['p/g_' + tableHeaderNumber],
    //                     'fta': tableData[i]['fta/g_' + tableHeaderNumber],
    //                     'fga': tableData[i]['fga/g_' + tableHeaderNumber],
    //                 });

    //                 callback();
    //             }, function (err) {

    //                 scraper.get('https://baseballmonster.com/playerrankings.aspx?start=' + twoWeeksDate + '&end=' + todayDate)
    //                     .then(function (tableData) {
    //                         tableData = tableData[0];

    //                         var tableHeaderNumber = Object.getOwnPropertyNames(tableData[0])[0];
    //                         tableHeaderNumber = tableHeaderNumber.split('_')[1]

    //                         async.forEachOf(tableData, function (value, i, callback) {

    //                             BBMRankingsRecent.create({
    //                                 'overallRank': tableData[i]['Rank_' + tableHeaderNumber],
    //                                 'overallRating': tableData[i]['Value_' + tableHeaderNumber],
    //                                 'playerName': tableData[i]['Name_' + tableHeaderNumber],
    //                                 'ptsRating': tableData[i]['pV_' + tableHeaderNumber],
    //                                 'threeRating': tableData[i]['3V_' + tableHeaderNumber],
    //                                 'rebRating': tableData[i]['rV_' + tableHeaderNumber],
    //                                 'astRating': tableData[i]['aV_' + tableHeaderNumber],
    //                                 'stlRating': tableData[i]['sV_' + tableHeaderNumber],
    //                                 'blkRating': tableData[i]['bV_' + tableHeaderNumber],
    //                                 'fgMixedRating': tableData[i]['fg%V_' + tableHeaderNumber],
    //                                 'ftMixedRating': tableData[i]['ft%V_' + tableHeaderNumber],
    //                                 'toRating': tableData[i]['toV_' + tableHeaderNumber],
    //                                 'fgPct': tableData[i]['fg%_' + tableHeaderNumber],
    //                                 'ftPct': tableData[i]['ft%_' + tableHeaderNumber],
    //                                 'fG3M': tableData[i]['3/g_' + tableHeaderNumber],
    //                                 'reb': tableData[i]['r/g_' + tableHeaderNumber],
    //                                 'ast': tableData[i]['a/g_' + tableHeaderNumber],
    //                                 'tov': tableData[i]['to/g_' + tableHeaderNumber],
    //                                 'stl': tableData[i]['s/g_' + tableHeaderNumber],
    //                                 'blk': tableData[i]['b/g_' + tableHeaderNumber],
    //                                 'pts': tableData[i]['p/g_' + tableHeaderNumber],
    //                                 'fta': tableData[i]['fta/g_' + tableHeaderNumber],
    //                                 'fga': tableData[i]['fga/g_' + tableHeaderNumber],
    //                             });

    //                             callback();
    //                         }, function (err) {
    //                             return
    //                         })
    //                     });
    //             })
    //         });
}