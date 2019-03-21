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

        // console.log(mlbSeasonBatters[1])

        async.forEachOf(mlbSeasonBatters, function (value, i, callback) {
            if (mlbSeasonBatters[i].AB > 300) {
                // console.log(i)
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
                    if (mlbSeasonBatters[i].AB > 300) {
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
            if (mlbSeasonPitchers[i].IP > 25) {
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
                    if (mlbSeasonPitchers[i].IP > 25) {
                        // console.log(mlbSeasonPitchers[i].svRating)
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

    PlayerSeasonData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
    PlayerRecentData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
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