var request = require("request"),
    async = require("async"),
    nba = require("nba"),
    scraper = require('table-scraper'),
    stats = require("stats-lite");

var mongoose = require('mongoose'),
    PlayerSeasonData = mongoose.model('PlayerSeasonData'),
    PlayerRecentData = mongoose.model('PlayerRecentData'),
    BBMRankingsRecent = mongoose.model('BBMRankingsRecent'),
    BBMRankingsSeason = mongoose.model('BBMRankingsSeason')

exports.getRankings = function (req, res) {
    var playerRankings = [];
    var playerRankingsRecent = [];
    var nbaSeasonPlayers = [];
    var nbaRecentPlayers = [];

    var ftSeasonArray = [];
    var fgSeasonArray = [];
    var threeSeasonArray = [];
    var ptsSeasonArray = [];
    var rebSeasonArray = [];
    var astSeasonArray = [];
    var stlSeasonArray = [];
    var blkSeasonArray = [];
    var toSeasonArray = [];
    var ftaSeasonArray = [];
    var fgaSeasonArray = [];
    var minSeasonArray = [];
    var ftSeasonStDev;
    var fgSeasonStDev;
    var threeSeasonStDev;
    var ptsSeasonStDev;
    var rebSeasonStDev;
    var astSeasonStDev;
    var stlSeasonStDev;
    var blkSeasonStDev;
    var toSeasonStDev;
    var fgaSeasonStDev;
    var ftaSeasonStDev;
    var minSeasonStDev;
    var ftSeasonAvg;
    var fgSeasonAvg;
    var threeSeasonAvg;
    var ptsSeasonAvg;
    var rebSeasonAvg;
    var astSeasonAvg;
    var stlSeasonAvg;
    var blkSeasonAvg;
    var toSeasonAvg;
    var minSeasonAvg;
    var ftaSeasonAvg;
    var fgaSeasonAvg;
    var ftMixedSeasonAvg;
    var fgMixedSeasonAvg;
    var minSeasonAvg;

    var ftRecentArray = [];
    var fgRecentArray = [];
    var threeRecentArray = [];
    var ptsRecentArray = [];
    var rebRecentArray = [];
    var astRecentArray = [];
    var stlRecentArray = [];
    var blkRecentArray = [];
    var toRecentArray = [];
    var ftaRecentArray = [];
    var fgaRecentArray = [];
    var minRecentArray = [];
    var ftRecentStDev;
    var fgRecentStDev;
    var threeRecentStDev;
    var ptsRecentStDev;
    var rebRecentStDev;
    var astRecentStDev;
    var stlRecentStDev;
    var blkRecentStDev;
    var toRecentStDev;
    var ftaRecentStDev;
    var fgaRecentStDev;
    var minRecentStDev;
    var ftRecentAvg;
    var fgRecentAvg;
    var threeRecentAvg;
    var ptsRecentAvg;
    var rebRecentAvg;
    var astRecentAvg;
    var stlRecentAvg;
    var blkRecentAvg;
    var toRecentAvg;
    var ftaRecentAvg;
    var fgaRecentAvg;
    var ftMixedRecentAvg;
    var fgMixedRecentAvg;
    var minRecentAvg;

    PlayerSeasonData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
    PlayerRecentData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });

    nba.stats.playerStats({ leagueID: "00" }).then(function (data) {

        nbaSeasonPlayers.push(data.leagueDashPlayerStats);
        nbaSeasonPlayers = nbaSeasonPlayers[0];

        async.forEachOf(nbaSeasonPlayers, function (value, i, callback) {
            if (nbaSeasonPlayers[i].nbaFantasyPtsRank < 175) {
                ftSeasonArray.push(nbaSeasonPlayers[i].ftPct);
                fgSeasonArray.push(nbaSeasonPlayers[i].fgPct);
                threeSeasonArray.push(nbaSeasonPlayers[i].fG3M);
                ptsSeasonArray.push(nbaSeasonPlayers[i].pts);
                rebSeasonArray.push(nbaSeasonPlayers[i].reb);
                astSeasonArray.push(nbaSeasonPlayers[i].ast);
                stlSeasonArray.push(nbaSeasonPlayers[i].stl);
                blkSeasonArray.push(nbaSeasonPlayers[i].blk);
                toSeasonArray.push(nbaSeasonPlayers[i].tov);
                ftaSeasonArray.push(nbaSeasonPlayers[i].fta);
                fgaSeasonArray.push(nbaSeasonPlayers[i].fga);
                minSeasonArray.push(nbaSeasonPlayers[i].min);
            }

            callback();
        }, function (err) {
            ftSeasonStDev = (stats.stdev(ftSeasonArray).toFixed(2) / 2);
            fgSeasonStDev = (stats.stdev(fgSeasonArray).toFixed(2));
            threeSeasonStDev = stats.stdev(threeSeasonArray).toFixed(2);
            ptsSeasonStDev = stats.stdev(ptsSeasonArray).toFixed(2);
            rebSeasonStDev = stats.stdev(rebSeasonArray).toFixed(2);
            astSeasonStDev = stats.stdev(astSeasonArray).toFixed(2);
            stlSeasonStDev = stats.stdev(stlSeasonArray).toFixed(2);
            blkSeasonStDev = stats.stdev(blkSeasonArray).toFixed(2);
            toSeasonStDev = stats.stdev(toSeasonArray).toFixed(2);
            ftaSeasonStDev = stats.stdev(ftaSeasonArray).toFixed(2);
            fgaSeasonStDev = stats.stdev(fgaSeasonArray).toFixed(2);
            minSeasonStDev = (stats.stdev(minSeasonArray) * 5).toFixed(2);

            ftSeasonAvg = stats.mean(ftSeasonArray).toFixed(2);
            fgSeasonAvg = stats.mean(fgSeasonArray).toFixed(2);
            threeSeasonAvg = stats.mean(threeSeasonArray).toFixed(2);
            ptsSeasonAvg = stats.mean(ptsSeasonArray).toFixed(2);
            rebSeasonAvg = stats.mean(rebSeasonArray).toFixed(2);
            astSeasonAvg = stats.mean(astSeasonArray).toFixed(2);
            stlSeasonAvg = stats.mean(stlSeasonArray).toFixed(2);
            blkSeasonAvg = stats.mean(blkSeasonArray).toFixed(2);
            toSeasonAvg = stats.mean(toSeasonArray).toFixed(2);
            ftaSeasonAvg = stats.mean(ftaSeasonArray).toFixed(2);
            fgaSeasonAvg = stats.mean(fgaSeasonArray).toFixed(2);
            minSeasonAvg = stats.mean(minSeasonArray).toFixed(2);

            for (var i = 0; i < nbaSeasonPlayers.length; i++) {
                var ftRating = Number((nbaSeasonPlayers[i].ftPct - ftSeasonAvg) / ftSeasonStDev).toFixed(2);
                var fgRating = Number((nbaSeasonPlayers[i].fgPct - fgSeasonAvg) / fgSeasonStDev).toFixed(2);
                var threeRating = Number((nbaSeasonPlayers[i].fG3M - threeSeasonAvg) / threeSeasonStDev).toFixed(2);
                var rebRating = Number((nbaSeasonPlayers[i].reb - rebSeasonAvg) / rebSeasonStDev).toFixed(2);
                var astRating = Number((nbaSeasonPlayers[i].ast - astSeasonAvg) / astSeasonStDev).toFixed(2);
                var ptsRating = Number((nbaSeasonPlayers[i].pts - ptsSeasonAvg) / ptsSeasonStDev).toFixed(2);
                var stlRating = Number((nbaSeasonPlayers[i].stl - stlSeasonAvg) / stlSeasonStDev).toFixed(2);
                var blkRating = Number((nbaSeasonPlayers[i].blk - blkSeasonAvg) / blkSeasonStDev).toFixed(2);
                var toRating = Number(0 - (nbaSeasonPlayers[i].tov - toSeasonAvg) / toSeasonStDev).toFixed(2);
                var ftaRating = Number((nbaSeasonPlayers[i].fta - ftaSeasonAvg) / ftaSeasonStDev).toFixed(2);
                var fgaRating = Number((nbaSeasonPlayers[i].fga - fgaSeasonAvg) / fgaSeasonStDev).toFixed(2);
                var minRating = Number((nbaSeasonPlayers[i].min - minSeasonAvg) / minSeasonStDev).toFixed(2);

                threeRating = (+threeRating + +minRating).toFixed(2);
                rebRating = (+rebRating + +minRating).toFixed(2);
                astRating = (+astRating + +minRating).toFixed(2);
                ptsRating = (+ptsRating + +minRating).toFixed(2);
                stlRating = (+stlRating + +minRating).toFixed(2);
                blkRating = (+blkRating + +minRating).toFixed(2);
                toRating = (+toRating + +minRating).toFixed(2);
                var ftMixedRating = ((+ftRating + +ftaRating) / 2).toFixed(2);
                var fgMixedRating = ((+fgRating + +fgaRating) / 2).toFixed(2);

                var overallRating = ((+ftMixedRating + +fgMixedRating + +threeRating + +rebRating + +astRating + +ptsRating + +stlRating + +blkRating + +toRating) / 9).toFixed(2);

                nbaSeasonPlayers[i].fgRating = fgRating;
                nbaSeasonPlayers[i].threeRating = threeRating;
                nbaSeasonPlayers[i].rebRating = rebRating;
                nbaSeasonPlayers[i].astRating = astRating;
                nbaSeasonPlayers[i].ptsRating = ptsRating;
                nbaSeasonPlayers[i].stlRating = stlRating;
                nbaSeasonPlayers[i].blkRating = blkRating;
                nbaSeasonPlayers[i].toRating = toRating;
                nbaSeasonPlayers[i].ftRating = ftRating;
                nbaSeasonPlayers[i].ftaRating = ftaRating;
                nbaSeasonPlayers[i].fgaRating = fgaRating;
                nbaSeasonPlayers[i].ftMixedRating = ftMixedRating;
                nbaSeasonPlayers[i].fgMixedRating = fgMixedRating;
                nbaSeasonPlayers[i].overallRating = overallRating;
            }
        })

    }).then(function (data) {
        nba.stats.playerStats({ leagueID: "00", LastNGames: "7" }).then(function (data) {

            nbaRecentPlayers.push(data.leagueDashPlayerStats)
            nbaRecentPlayers = nbaRecentPlayers[0]

            async.forEachOf(nbaRecentPlayers, function (value, i, callback) {
                if (nbaRecentPlayers[i].nbaFantasyPtsRank < 175) {
                    ftRecentArray.push(nbaRecentPlayers[i].ftPct);
                    fgRecentArray.push(nbaRecentPlayers[i].fgPct);
                    threeRecentArray.push(nbaRecentPlayers[i].fG3M);
                    ptsRecentArray.push(nbaRecentPlayers[i].pts);
                    rebRecentArray.push(nbaRecentPlayers[i].reb);
                    astRecentArray.push(nbaRecentPlayers[i].ast);
                    stlRecentArray.push(nbaRecentPlayers[i].stl);
                    blkRecentArray.push(nbaRecentPlayers[i].blk);
                    toRecentArray.push(nbaRecentPlayers[i].tov);
                    ftaRecentArray.push(nbaRecentPlayers[i].fta);
                    fgaRecentArray.push(nbaRecentPlayers[i].fga);
                    minRecentArray.push(nbaRecentPlayers[i].min);
                }
                callback();
            }, function (err) {
                ftRecentStDev = (stats.stdev(ftRecentArray).toFixed(2) / 2);
                fgRecentStDev = (stats.stdev(fgRecentArray).toFixed(2));
                threeRecentStDev = stats.stdev(threeRecentArray).toFixed(2);
                ptsRecentStDev = stats.stdev(ptsRecentArray).toFixed(2);
                rebRecentStDev = stats.stdev(rebRecentArray).toFixed(2);
                astRecentStDev = stats.stdev(astRecentArray).toFixed(2);
                stlRecentStDev = stats.stdev(stlRecentArray).toFixed(2);
                blkRecentStDev = stats.stdev(blkRecentArray).toFixed(2);
                toRecentStDev = stats.stdev(toRecentArray).toFixed(2);
                ftaRecentStDev = stats.stdev(ftaRecentArray).toFixed(2);
                fgaRecentStDev = stats.stdev(fgaRecentArray).toFixed(2);
                minRecentStDev = (stats.stdev(minRecentArray) * 5).toFixed(2);

                ftRecentAvg = stats.mean(ftRecentArray).toFixed(2);
                fgRecentAvg = stats.mean(fgRecentArray).toFixed(2);
                threeRecentAvg = stats.mean(threeRecentArray).toFixed(2);
                ptsRecentAvg = stats.mean(ptsRecentArray).toFixed(2);
                rebRecentAvg = stats.mean(rebRecentArray).toFixed(2);
                astRecentAvg = stats.mean(astRecentArray).toFixed(2);
                stlRecentAvg = stats.mean(stlRecentArray).toFixed(2);
                blkRecentAvg = stats.mean(blkRecentArray).toFixed(2);
                toRecentAvg = stats.mean(toRecentArray).toFixed(2);
                ftaRecentAvg = stats.mean(ftaRecentArray).toFixed(2);
                fgaRecentAvg = stats.mean(fgaRecentArray).toFixed(2);
                minRecentAvg = stats.mean(minRecentArray).toFixed(2);

                for (var i = 0; i < nbaRecentPlayers.length; i++) {
                    var ftRating = Number((nbaRecentPlayers[i].ftPct - ftRecentAvg) / ftRecentStDev).toFixed(2);
                    var fgRating = Number((nbaRecentPlayers[i].fgPct - fgRecentAvg) / fgRecentStDev).toFixed(2);
                    var threeRating = Number((nbaRecentPlayers[i].fG3M - threeRecentAvg) / threeRecentStDev).toFixed(2);
                    var rebRating = Number((nbaRecentPlayers[i].reb - rebRecentAvg) / rebRecentStDev).toFixed(2);
                    var astRating = Number((nbaRecentPlayers[i].ast - astRecentAvg) / astRecentStDev).toFixed(2);
                    var ptsRating = Number((nbaRecentPlayers[i].pts - ptsRecentAvg) / ptsRecentStDev).toFixed(2);
                    var stlRating = Number((nbaRecentPlayers[i].stl - stlRecentAvg) / stlRecentStDev).toFixed(2);
                    var blkRating = Number((nbaRecentPlayers[i].blk - blkRecentAvg) / blkRecentStDev).toFixed(2);
                    var toRating = Number(0 - (nbaRecentPlayers[i].tov - toRecentAvg) / toRecentStDev).toFixed(2);
                    var ftaRating = Number((nbaRecentPlayers[i].fta - ftaRecentAvg) / ftaRecentStDev).toFixed(2);
                    var fgaRating = Number((nbaRecentPlayers[i].fga - fgaRecentAvg) / fgaRecentStDev).toFixed(2);
                    var minRating = Number((nbaRecentPlayers[i].min - minSeasonAvg) / minSeasonStDev).toFixed(2);

                    threeRating = (+threeRating + +minRating).toFixed(2);
                    rebRating = (+rebRating + +minRating).toFixed(2);
                    astRating = (+astRating + +minRating).toFixed(2);
                    ptsRating = (+ptsRating + +minRating).toFixed(2);
                    stlRating = (+stlRating + +minRating).toFixed(2);
                    blkRating = (+blkRating + +minRating).toFixed(2);
                    toRating = (+toRating + +minRating).toFixed(2);
                    var ftMixedRating = ((+ftRating + +ftaRating) / 2).toFixed(2);
                    var fgMixedRating = ((+fgRating + +fgaRating) / 2).toFixed(2);

                    var overallRating = ((+ftMixedRating + +fgMixedRating + +threeRating + +rebRating + +astRating + +ptsRating + +stlRating + +blkRating + +toRating) / 9).toFixed(2);

                    nbaRecentPlayers[i].fgRating = fgRating;
                    nbaRecentPlayers[i].threeRating = threeRating;
                    nbaRecentPlayers[i].rebRating = rebRating;
                    nbaRecentPlayers[i].astRating = astRating;
                    nbaRecentPlayers[i].ptsRating = ptsRating;
                    nbaRecentPlayers[i].stlRating = stlRating;
                    nbaRecentPlayers[i].blkRating = blkRating;
                    nbaRecentPlayers[i].toRating = toRating;
                    nbaRecentPlayers[i].ftRating = ftRating;
                    nbaRecentPlayers[i].ftMixedRating = ftMixedRating;
                    nbaRecentPlayers[i].fgMixedRating = fgMixedRating;
                    nbaRecentPlayers[i].overallRating = overallRating;
                }
            })
        }).then(function (data) {
            async.parallel({
                one: function (callback) {

                    playerRank = 1;

                    nbaSeasonPlayers.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                    for (var i = 0; i < nbaSeasonPlayers.length; i++) {
                        if (nbaSeasonPlayers[i].gpRank < 350) {
                            PlayerSeasonData.create({
                                playerId: nbaSeasonPlayers[i].playerId,
                                playerName: nbaSeasonPlayers[i].playerName,
                                teamId: nbaSeasonPlayers[i].teamId,
                                teamAbbreviation: nbaSeasonPlayers[i].teamAbbreviation,
                                min: nbaSeasonPlayers[i].min,
                                fgPct: nbaSeasonPlayers[i].fgPct,
                                ftPct: nbaSeasonPlayers[i].ftPct,
                                fG3M: nbaSeasonPlayers[i].fG3M,
                                reb: nbaSeasonPlayers[i].reb,
                                ast: nbaSeasonPlayers[i].ast,
                                tov: nbaSeasonPlayers[i].tov,
                                stl: nbaSeasonPlayers[i].stl,
                                blk: nbaSeasonPlayers[i].blk,
                                pts: nbaSeasonPlayers[i].pts,
                                fta: nbaSeasonPlayers[i].fta,
                                fga: nbaSeasonPlayers[i].fga,
                                fgPctRank: nbaSeasonPlayers[i].fgPctRank,
                                ftPctRank: nbaSeasonPlayers[i].ftPctRank,
                                fg3mRank: nbaSeasonPlayers[i].fg3mRank,
                                rebRank: nbaSeasonPlayers[i].rebRank,
                                astRank: nbaSeasonPlayers[i].astRank,
                                tovRank: nbaSeasonPlayers[i].tovRank,
                                stlRank: nbaSeasonPlayers[i].stlRank,
                                blkRank: nbaSeasonPlayers[i].blkRank,
                                ptsRank: nbaSeasonPlayers[i].ptsRank,
                                ftaRank: nbaSeasonPlayers[i].ftaRank,
                                fgaRank: nbaSeasonPlayers[i].ftaRank,
                                ftRating: nbaSeasonPlayers[i].ftRating,
                                fgRating: nbaSeasonPlayers[i].fgRating,
                                ptsRating: nbaSeasonPlayers[i].ptsRating,
                                threeRating: nbaSeasonPlayers[i].threeRating,
                                rebRating: nbaSeasonPlayers[i].rebRating,
                                astRating: nbaSeasonPlayers[i].astRating,
                                stlRating: nbaSeasonPlayers[i].stlRating,
                                blkRating: nbaSeasonPlayers[i].blkRating,
                                toRating: nbaSeasonPlayers[i].toRating,
                                ftaRating: nbaSeasonPlayers[i].ftaRating,
                                fgaRating: nbaSeasonPlayers[i].fgaRating,
                                ftMixedRating: nbaSeasonPlayers[i].ftMixedRating,
                                fgMixedRating: nbaSeasonPlayers[i].fgMixedRating,
                                overallRating: nbaSeasonPlayers[i].overallRating,
                                overallRank: playerRank
                            });
                            playerRank++
                        }
                    }
                    callback()
                },
                two: function (callback) {
                    nbaRecentPlayers.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

                    playerRank = 1;

                    for (var i = 0; i < nbaRecentPlayers.length; i++) {
                        if (nbaRecentPlayers[i].gpRank < 350) {
                            PlayerRecentData.create({
                                playerId: nbaRecentPlayers[i].playerId,
                                playerName: nbaRecentPlayers[i].playerName,
                                teamId: nbaRecentPlayers[i].teamId,
                                teamAbbreviation: nbaRecentPlayers[i].teamAbbreviation,
                                min: nbaRecentPlayers[i].min,
                                fgPct: nbaRecentPlayers[i].fgPct,
                                ftPct: nbaRecentPlayers[i].ftPct,
                                fG3M: nbaRecentPlayers[i].fG3M,
                                reb: nbaRecentPlayers[i].reb,
                                ast: nbaRecentPlayers[i].ast,
                                tov: nbaRecentPlayers[i].tov,
                                stl: nbaRecentPlayers[i].stl,
                                blk: nbaRecentPlayers[i].blk,
                                pts: nbaRecentPlayers[i].pts,
                                fta: nbaRecentPlayers[i].fta,
                                fga: nbaRecentPlayers[i].fga,
                                fgPctRank: nbaRecentPlayers[i].fgPctRank,
                                ftPctRank: nbaRecentPlayers[i].ftPctRank,
                                fg3mRank: nbaRecentPlayers[i].fg3mRank,
                                rebRank: nbaRecentPlayers[i].rebRank,
                                astRank: nbaRecentPlayers[i].astRank,
                                tovRank: nbaRecentPlayers[i].tovRank,
                                stlRank: nbaRecentPlayers[i].stlRank,
                                blkRank: nbaRecentPlayers[i].blkRank,
                                ptsRank: nbaRecentPlayers[i].ptsRank,
                                ftaRank: nbaRecentPlayers[i].ftaRank,
                                fgaRank: nbaRecentPlayers[i].fgaRank,
                                ftRating: nbaRecentPlayers[i].ftRating,
                                fgRating: nbaRecentPlayers[i].fgRating,
                                ptsRating: nbaRecentPlayers[i].ptsRating,
                                threeRating: nbaRecentPlayers[i].threeRating,
                                rebRating: nbaRecentPlayers[i].rebRating,
                                astRating: nbaRecentPlayers[i].astRating,
                                stlRating: nbaRecentPlayers[i].stlRating,
                                blkRating: nbaRecentPlayers[i].blkRating,
                                toRating: nbaRecentPlayers[i].toRating,
                                ftaRating: nbaRecentPlayers[i].ftaRating,
                                fgaRating: nbaRecentPlayers[i].fgaRating,
                                ftMixedRating: nbaRecentPlayers[i].ftMixedRating,
                                fgMixedRating: nbaRecentPlayers[i].fgMixedRating,
                                overallRating: nbaRecentPlayers[i].overallRating,
                                overallRank: playerRank
                            });
                            playerRank++
                        }

                    }
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
    })
}

exports.getBBMRankings = function () {
    var playerRankings = [];
    var playerRankingsTwoWeeks = [];
    var todayFullDate = new Date();
    var todayDate = ("0" + (todayFullDate.getMonth() + 1)).slice(-2);
    var twoWeeksFullDate = new Date(+new Date - 12096e5)
    var twoWeeksDate = ("0" + (twoWeeksFullDate.getMonth() + 1)).slice(-2);
    var seasonStartYear;
    todayDate = todayDate + ("0" + todayFullDate.getDate()).slice(-2);
    todayDate = todayDate + todayFullDate.getUTCFullYear();
    twoWeeksDate = twoWeeksDate + ("0" + twoWeeksFullDate.getDate()).slice(-2);;
    twoWeeksDate = twoWeeksDate + twoWeeksFullDate.getUTCFullYear();

    //If it is before july, then teh season start date should be the year before
    if (todayFullDate.getMonth() < 7) {
        seasonStartYear = todayFullDate.getUTCFullYear() - 1;
    } else {
        seasonStartYear = todayFullDate.getUTCFullYear();
    }

    BBMRankingsSeason.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
    BBMRankingsRecent.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });

    //Get rankings for season
    scraper.get('https://basketballmonster.com/playerrankings.aspx?start=0701' + seasonStartYear + '&end=' + todayDate)
        .then(function (tableData) {
            tableData = tableData[0];
            async.forEachOf(tableData, function (value, i, callback) {

                var tableHeaderNumber = Object.getOwnPropertyNames(tableData[0])[0];
                tableHeaderNumber = tableHeaderNumber.split('_')[1]

                BBMRankingsSeason.create({
                    'overallRank': tableData[i]['Rank_' + tableHeaderNumber],
                    'overallRating': tableData[i]['Value_' + tableHeaderNumber],
                    'playerName': tableData[i]['Name_' + tableHeaderNumber],
                    'ptsRating': tableData[i]['pV_' + tableHeaderNumber],
                    'threeRating': tableData[i]['3V_' + tableHeaderNumber],
                    'rebRating': tableData[i]['rV_' + tableHeaderNumber],
                    'astRating': tableData[i]['aV_' + tableHeaderNumber],
                    'stlRating': tableData[i]['sV_' + tableHeaderNumber],
                    'blkRating': tableData[i]['bV_' + tableHeaderNumber],
                    'fgMixedRating': tableData[i]['fg%V_' + tableHeaderNumber],
                    'ftMixedRating': tableData[i]['ft%V_' + tableHeaderNumber],
                    'toRating': tableData[i]['toV_' + tableHeaderNumber],
                    'fgPct': tableData[i]['fg%_' + tableHeaderNumber],
                    'ftPct': tableData[i]['ft%_' + tableHeaderNumber],
                    'fG3M': tableData[i]['3/g_' + tableHeaderNumber],
                    'reb': tableData[i]['r/g_' + tableHeaderNumber],
                    'ast': tableData[i]['a/g_' + tableHeaderNumber],
                    'tov': tableData[i]['to/g_' + tableHeaderNumber],
                    'stl': tableData[i]['s/g_' + tableHeaderNumber],
                    'blk': tableData[i]['b/g_' + tableHeaderNumber],
                    'pts': tableData[i]['p/g_' + tableHeaderNumber],
                    'fta': tableData[i]['fta/g_' + tableHeaderNumber],
                    'fga': tableData[i]['fga/g_' + tableHeaderNumber],
                });

                callback();
            }, function (err) {

                scraper.get('https://basketballmonster.com/playerrankings.aspx?start=' + twoWeeksDate + '&end=' + todayDate)
                    .then(function (tableData) {
                        tableData = tableData[0];

                        var tableHeaderNumber = Object.getOwnPropertyNames(tableData[0])[0];
                        tableHeaderNumber = tableHeaderNumber.split('_')[1]

                        async.forEachOf(tableData, function (value, i, callback) {

                            BBMRankingsRecent.create({
                                'overallRank': tableData[i]['Rank_' + tableHeaderNumber],
                                'overallRating': tableData[i]['Value_' + tableHeaderNumber],
                                'playerName': tableData[i]['Name_' + tableHeaderNumber],
                                'ptsRating': tableData[i]['pV_' + tableHeaderNumber],
                                'threeRating': tableData[i]['3V_' + tableHeaderNumber],
                                'rebRating': tableData[i]['rV_' + tableHeaderNumber],
                                'astRating': tableData[i]['aV_' + tableHeaderNumber],
                                'stlRating': tableData[i]['sV_' + tableHeaderNumber],
                                'blkRating': tableData[i]['bV_' + tableHeaderNumber],
                                'fgMixedRating': tableData[i]['fg%V_' + tableHeaderNumber],
                                'ftMixedRating': tableData[i]['ft%V_' + tableHeaderNumber],
                                'toRating': tableData[i]['toV_' + tableHeaderNumber],
                                'fgPct': tableData[i]['fg%_' + tableHeaderNumber],
                                'ftPct': tableData[i]['ft%_' + tableHeaderNumber],
                                'fG3M': tableData[i]['3/g_' + tableHeaderNumber],
                                'reb': tableData[i]['r/g_' + tableHeaderNumber],
                                'ast': tableData[i]['a/g_' + tableHeaderNumber],
                                'tov': tableData[i]['to/g_' + tableHeaderNumber],
                                'stl': tableData[i]['s/g_' + tableHeaderNumber],
                                'blk': tableData[i]['b/g_' + tableHeaderNumber],
                                'pts': tableData[i]['p/g_' + tableHeaderNumber],
                                'fta': tableData[i]['fta/g_' + tableHeaderNumber],
                                'fga': tableData[i]['fga/g_' + tableHeaderNumber],
                            });

                            callback();
                        }, function (err) {
                            return
                        })
                    });
            })
        });
}