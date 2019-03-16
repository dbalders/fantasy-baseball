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
            // console.log(gamesSeasonStDev)
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
            console.log(avgSeasonAvg)
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

                var overallRating = ((+hitRating + +doubleRating + +homeRunRating + +runRating + +rbiRating + +sbRating + +avgRating + +obpRating + +slgRating + +opsRating) / 9).toFixed(2);

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
// });

// var ftSeasonArray = [];
// var fgSeasonArray = [];
// var threeSeasonArray = [];
// var ptsSeasonArray = [];
// var rebSeasonArray = [];
// var astSeasonArray = [];
// var stlSeasonArray = [];
// var blkSeasonArray = [];
// var toSeasonArray = [];
// var ftaSeasonArray = [];
// var fgaSeasonArray = [];
// var minSeasonArray = [];
// var ftSeasonStDev;
// var fgSeasonStDev;
// var threeSeasonStDev;
// var ptsSeasonStDev;
// var rebSeasonStDev;
// var astSeasonStDev;
// var stlSeasonStDev;
// var blkSeasonStDev;
// var toSeasonStDev;
// var fgaSeasonStDev;
// var ftaSeasonStDev;
// var minSeasonStDev;
// var ftSeasonAvg;
// var fgSeasonAvg;
// var threeSeasonAvg;
// var ptsSeasonAvg;
// var rebSeasonAvg;
// var astSeasonAvg;
// var stlSeasonAvg;
// var blkSeasonAvg;
// var toSeasonAvg;
// var minSeasonAvg;
// var ftaSeasonAvg;
// var fgaSeasonAvg;
// var ftMixedSeasonAvg;
// var fgMixedSeasonAvg;
// var minSeasonAvg;

// var ftRecentArray = [];
// var fgRecentArray = [];
// var threeRecentArray = [];
// var ptsRecentArray = [];
// var rebRecentArray = [];
// var astRecentArray = [];
// var stlRecentArray = [];
// var blkRecentArray = [];
// var toRecentArray = [];
// var ftaRecentArray = [];
// var fgaRecentArray = [];
// var minRecentArray = [];
// var ftRecentStDev;
// var fgRecentStDev;
// var threeRecentStDev;
// var ptsRecentStDev;
// var rebRecentStDev;
// var astRecentStDev;
// var stlRecentStDev;
// var blkRecentStDev;
// var toRecentStDev;
// var ftaRecentStDev;
// var fgaRecentStDev;
// var minRecentStDev;
// var ftRecentAvg;
// var fgRecentAvg;
// var threeRecentAvg;
// var ptsRecentAvg;
// var rebRecentAvg;
// var astRecentAvg;
// var stlRecentAvg;
// var blkRecentAvg;
// var toRecentAvg;
// var ftaRecentAvg;
// var fgaRecentAvg;
// var ftMixedRecentAvg;
// var fgMixedRecentAvg;
// var minRecentAvg;

PlayerSeasonData.remove({}, function (err, task) {
    if (err)
        res.send(err);
});
PlayerRecentData.remove({}, function (err, task) {
    if (err)
        res.send(err);
});



    // nba.stats.playerStats({ leagueID: "00" }).then(function (data) {

    //     mlbSeasonBatters.push(data.leagueDashPlayerStats);
    //     mlbSeasonBatters = mlbSeasonBatters[0];

    //     async.forEachOf(mlbSeasonBatters, function (value, i, callback) {
    //         if (mlbSeasonBatters[i].nbaFantasyPtsRank < 175) {
    //             ftSeasonArray.push(mlbSeasonBatters[i].ftPct);
    //             fgSeasonArray.push(mlbSeasonBatters[i].fgPct);
    //             threeSeasonArray.push(mlbSeasonBatters[i].fG3M);
    //             ptsSeasonArray.push(mlbSeasonBatters[i].pts);
    //             rebSeasonArray.push(mlbSeasonBatters[i].reb);
    //             astSeasonArray.push(mlbSeasonBatters[i].ast);
    //             stlSeasonArray.push(mlbSeasonBatters[i].stl);
    //             blkSeasonArray.push(mlbSeasonBatters[i].blk);
    //             toSeasonArray.push(mlbSeasonBatters[i].tov);
    //             ftaSeasonArray.push(mlbSeasonBatters[i].fta);
    //             fgaSeasonArray.push(mlbSeasonBatters[i].fga);
    //             minSeasonArray.push(mlbSeasonBatters[i].min);
    //         }

    //         callback();
    //     }, function (err) {
    //         ftSeasonStDev = (stats.stdev(ftSeasonArray).toFixed(2) / 2);
    //         fgSeasonStDev = (stats.stdev(fgSeasonArray).toFixed(2));
    //         threeSeasonStDev = stats.stdev(threeSeasonArray).toFixed(2);
    //         ptsSeasonStDev = stats.stdev(ptsSeasonArray).toFixed(2);
    //         rebSeasonStDev = stats.stdev(rebSeasonArray).toFixed(2);
    //         astSeasonStDev = stats.stdev(astSeasonArray).toFixed(2);
    //         stlSeasonStDev = stats.stdev(stlSeasonArray).toFixed(2);
    //         blkSeasonStDev = stats.stdev(blkSeasonArray).toFixed(2);
    //         toSeasonStDev = stats.stdev(toSeasonArray).toFixed(2);
    //         ftaSeasonStDev = stats.stdev(ftaSeasonArray).toFixed(2);
    //         fgaSeasonStDev = stats.stdev(fgaSeasonArray).toFixed(2);
    //         minSeasonStDev = (stats.stdev(minSeasonArray) * 5).toFixed(2);

    //         ftSeasonAvg = stats.mean(ftSeasonArray).toFixed(2);
    //         fgSeasonAvg = stats.mean(fgSeasonArray).toFixed(2);
    //         threeSeasonAvg = stats.mean(threeSeasonArray).toFixed(2);
    //         ptsSeasonAvg = stats.mean(ptsSeasonArray).toFixed(2);
    //         rebSeasonAvg = stats.mean(rebSeasonArray).toFixed(2);
    //         astSeasonAvg = stats.mean(astSeasonArray).toFixed(2);
    //         stlSeasonAvg = stats.mean(stlSeasonArray).toFixed(2);
    //         blkSeasonAvg = stats.mean(blkSeasonArray).toFixed(2);
    //         toSeasonAvg = stats.mean(toSeasonArray).toFixed(2);
    //         ftaSeasonAvg = stats.mean(ftaSeasonArray).toFixed(2);
    //         fgaSeasonAvg = stats.mean(fgaSeasonArray).toFixed(2);
    //         minSeasonAvg = stats.mean(minSeasonArray).toFixed(2);

    //         for (var i = 0; i < mlbSeasonBatters.length; i++) {
    //             var ftRating = Number((mlbSeasonBatters[i].ftPct - ftSeasonAvg) / ftSeasonStDev).toFixed(2);
    //             var fgRating = Number((mlbSeasonBatters[i].fgPct - fgSeasonAvg) / fgSeasonStDev).toFixed(2);
    //             var threeRating = Number((mlbSeasonBatters[i].fG3M - threeSeasonAvg) / threeSeasonStDev).toFixed(2);
    //             var rebRating = Number((mlbSeasonBatters[i].reb - rebSeasonAvg) / rebSeasonStDev).toFixed(2);
    //             var astRating = Number((mlbSeasonBatters[i].ast - astSeasonAvg) / astSeasonStDev).toFixed(2);
    //             var ptsRating = Number((mlbSeasonBatters[i].pts - ptsSeasonAvg) / ptsSeasonStDev).toFixed(2);
    //             var stlRating = Number((mlbSeasonBatters[i].stl - stlSeasonAvg) / stlSeasonStDev).toFixed(2);
    //             var blkRating = Number((mlbSeasonBatters[i].blk - blkSeasonAvg) / blkSeasonStDev).toFixed(2);
    //             var toRating = Number(0 - (mlbSeasonBatters[i].tov - toSeasonAvg) / toSeasonStDev).toFixed(2);
    //             var ftaRating = Number((mlbSeasonBatters[i].fta - ftaSeasonAvg) / ftaSeasonStDev).toFixed(2);
    //             var fgaRating = Number((mlbSeasonBatters[i].fga - fgaSeasonAvg) / fgaSeasonStDev).toFixed(2);
    //             var minRating = Number((mlbSeasonBatters[i].min - minSeasonAvg) / minSeasonStDev).toFixed(2);

    //             threeRating = (+threeRating + +minRating).toFixed(2);
    //             rebRating = (+rebRating + +minRating).toFixed(2);
    //             astRating = (+astRating + +minRating).toFixed(2);
    //             ptsRating = (+ptsRating + +minRating).toFixed(2);
    //             stlRating = (+stlRating + +minRating).toFixed(2);
    //             blkRating = (+blkRating + +minRating).toFixed(2);
    //             toRating = (+toRating + +minRating).toFixed(2);
    //             var ftMixedRating = ((+ftRating + +ftaRating) / 2).toFixed(2);
    //             var fgMixedRating = ((+fgRating + +fgaRating) / 2).toFixed(2);

    //             var overallRating = ((+ftMixedRating + +fgMixedRating + +threeRating + +rebRating + +astRating + +ptsRating + +stlRating + +blkRating + +toRating) / 9).toFixed(2);

    //             mlbSeasonBatters[i].fgRating = fgRating;
    //             mlbSeasonBatters[i].threeRating = threeRating;
    //             mlbSeasonBatters[i].rebRating = rebRating;
    //             mlbSeasonBatters[i].astRating = astRating;
    //             mlbSeasonBatters[i].ptsRating = ptsRating;
    //             mlbSeasonBatters[i].stlRating = stlRating;
    //             mlbSeasonBatters[i].blkRating = blkRating;
    //             mlbSeasonBatters[i].toRating = toRating;
    //             mlbSeasonBatters[i].ftRating = ftRating;
    //             mlbSeasonBatters[i].ftaRating = ftaRating;
    //             mlbSeasonBatters[i].fgaRating = fgaRating;
    //             mlbSeasonBatters[i].ftMixedRating = ftMixedRating;
    //             mlbSeasonBatters[i].fgMixedRating = fgMixedRating;
    //             mlbSeasonBatters[i].overallRating = overallRating;
    //         }
    //     })

    // }).then(function (data) {
    //     nba.stats.playerStats({ leagueID: "00", LastNGames: "7" }).then(function (data) {

    //         mlbRecentBatters.push(data.leagueDashPlayerStats)
    //         mlbRecentBatters = mlbRecentBatters[0]

    //         async.forEachOf(mlbRecentBatters, function (value, i, callback) {
    //             if (mlbRecentBatters[i].nbaFantasyPtsRank < 175) {
    //                 ftRecentArray.push(mlbRecentBatters[i].ftPct);
    //                 fgRecentArray.push(mlbRecentBatters[i].fgPct);
    //                 threeRecentArray.push(mlbRecentBatters[i].fG3M);
    //                 ptsRecentArray.push(mlbRecentBatters[i].pts);
    //                 rebRecentArray.push(mlbRecentBatters[i].reb);
    //                 astRecentArray.push(mlbRecentBatters[i].ast);
    //                 stlRecentArray.push(mlbRecentBatters[i].stl);
    //                 blkRecentArray.push(mlbRecentBatters[i].blk);
    //                 toRecentArray.push(mlbRecentBatters[i].tov);
    //                 ftaRecentArray.push(mlbRecentBatters[i].fta);
    //                 fgaRecentArray.push(mlbRecentBatters[i].fga);
    //                 minRecentArray.push(mlbRecentBatters[i].min);
    //             }
    //             callback();
    //         }, function (err) {
    //             ftRecentStDev = (stats.stdev(ftRecentArray).toFixed(2) / 2);
    //             fgRecentStDev = (stats.stdev(fgRecentArray).toFixed(2));
    //             threeRecentStDev = stats.stdev(threeRecentArray).toFixed(2);
    //             ptsRecentStDev = stats.stdev(ptsRecentArray).toFixed(2);
    //             rebRecentStDev = stats.stdev(rebRecentArray).toFixed(2);
    //             astRecentStDev = stats.stdev(astRecentArray).toFixed(2);
    //             stlRecentStDev = stats.stdev(stlRecentArray).toFixed(2);
    //             blkRecentStDev = stats.stdev(blkRecentArray).toFixed(2);
    //             toRecentStDev = stats.stdev(toRecentArray).toFixed(2);
    //             ftaRecentStDev = stats.stdev(ftaRecentArray).toFixed(2);
    //             fgaRecentStDev = stats.stdev(fgaRecentArray).toFixed(2);
    //             minRecentStDev = (stats.stdev(minRecentArray) * 5).toFixed(2);

    //             ftRecentAvg = stats.mean(ftRecentArray).toFixed(2);
    //             fgRecentAvg = stats.mean(fgRecentArray).toFixed(2);
    //             threeRecentAvg = stats.mean(threeRecentArray).toFixed(2);
    //             ptsRecentAvg = stats.mean(ptsRecentArray).toFixed(2);
    //             rebRecentAvg = stats.mean(rebRecentArray).toFixed(2);
    //             astRecentAvg = stats.mean(astRecentArray).toFixed(2);
    //             stlRecentAvg = stats.mean(stlRecentArray).toFixed(2);
    //             blkRecentAvg = stats.mean(blkRecentArray).toFixed(2);
    //             toRecentAvg = stats.mean(toRecentArray).toFixed(2);
    //             ftaRecentAvg = stats.mean(ftaRecentArray).toFixed(2);
    //             fgaRecentAvg = stats.mean(fgaRecentArray).toFixed(2);
    //             minRecentAvg = stats.mean(minRecentArray).toFixed(2);

    //             for (var i = 0; i < mlbRecentBatters.length; i++) {
    //                 var ftRating = Number((mlbRecentBatters[i].ftPct - ftRecentAvg) / ftRecentStDev).toFixed(2);
    //                 var fgRating = Number((mlbRecentBatters[i].fgPct - fgRecentAvg) / fgRecentStDev).toFixed(2);
    //                 var threeRating = Number((mlbRecentBatters[i].fG3M - threeRecentAvg) / threeRecentStDev).toFixed(2);
    //                 var rebRating = Number((mlbRecentBatters[i].reb - rebRecentAvg) / rebRecentStDev).toFixed(2);
    //                 var astRating = Number((mlbRecentBatters[i].ast - astRecentAvg) / astRecentStDev).toFixed(2);
    //                 var ptsRating = Number((mlbRecentBatters[i].pts - ptsRecentAvg) / ptsRecentStDev).toFixed(2);
    //                 var stlRating = Number((mlbRecentBatters[i].stl - stlRecentAvg) / stlRecentStDev).toFixed(2);
    //                 var blkRating = Number((mlbRecentBatters[i].blk - blkRecentAvg) / blkRecentStDev).toFixed(2);
    //                 var toRating = Number(0 - (mlbRecentBatters[i].tov - toRecentAvg) / toRecentStDev).toFixed(2);
    //                 var ftaRating = Number((mlbRecentBatters[i].fta - ftaRecentAvg) / ftaRecentStDev).toFixed(2);
    //                 var fgaRating = Number((mlbRecentBatters[i].fga - fgaRecentAvg) / fgaRecentStDev).toFixed(2);
    //                 var minRating = Number((mlbRecentBatters[i].min - minSeasonAvg) / minSeasonStDev).toFixed(2);

    //                 threeRating = (+threeRating + +minRating).toFixed(2);
    //                 rebRating = (+rebRating + +minRating).toFixed(2);
    //                 astRating = (+astRating + +minRating).toFixed(2);
    //                 ptsRating = (+ptsRating + +minRating).toFixed(2);
    //                 stlRating = (+stlRating + +minRating).toFixed(2);
    //                 blkRating = (+blkRating + +minRating).toFixed(2);
    //                 toRating = (+toRating + +minRating).toFixed(2);
    //                 var ftMixedRating = ((+ftRating + +ftaRating) / 2).toFixed(2);
    //                 var fgMixedRating = ((+fgRating + +fgaRating) / 2).toFixed(2);

    //                 var overallRating = ((+ftMixedRating + +fgMixedRating + +threeRating + +rebRating + +astRating + +ptsRating + +stlRating + +blkRating + +toRating) / 9).toFixed(2);

    //                 mlbRecentBatters[i].fgRating = fgRating;
    //                 mlbRecentBatters[i].threeRating = threeRating;
    //                 mlbRecentBatters[i].rebRating = rebRating;
    //                 mlbRecentBatters[i].astRating = astRating;
    //                 mlbRecentBatters[i].ptsRating = ptsRating;
    //                 mlbRecentBatters[i].stlRating = stlRating;
    //                 mlbRecentBatters[i].blkRating = blkRating;
    //                 mlbRecentBatters[i].toRating = toRating;
    //                 mlbRecentBatters[i].ftRating = ftRating;
    //                 mlbRecentBatters[i].ftMixedRating = ftMixedRating;
    //                 mlbRecentBatters[i].fgMixedRating = fgMixedRating;
    //                 mlbRecentBatters[i].overallRating = overallRating;
    //             }
    //         })
    //     }).then(function (data) {
    //         async.parallel({
    //             one: function (callback) {

    //                 playerRank = 1;

    //                 mlbSeasonBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

    //                 for (var i = 0; i < mlbSeasonBatters.length; i++) {
    //                     if (mlbSeasonBatters[i].gpRank < 350) {
    //                         PlayerSeasonData.create({
    //                             playerId: mlbSeasonBatters[i].playerId,
    //                             playerName: mlbSeasonBatters[i].playerName,
    //                             teamId: mlbSeasonBatters[i].teamId,
    //                             teamAbbreviation: mlbSeasonBatters[i].teamAbbreviation,
    //                             min: mlbSeasonBatters[i].min,
    //                             fgPct: mlbSeasonBatters[i].fgPct,
    //                             ftPct: mlbSeasonBatters[i].ftPct,
    //                             fG3M: mlbSeasonBatters[i].fG3M,
    //                             reb: mlbSeasonBatters[i].reb,
    //                             ast: mlbSeasonBatters[i].ast,
    //                             tov: mlbSeasonBatters[i].tov,
    //                             stl: mlbSeasonBatters[i].stl,
    //                             blk: mlbSeasonBatters[i].blk,
    //                             pts: mlbSeasonBatters[i].pts,
    //                             fta: mlbSeasonBatters[i].fta,
    //                             fga: mlbSeasonBatters[i].fga,
    //                             fgPctRank: mlbSeasonBatters[i].fgPctRank,
    //                             ftPctRank: mlbSeasonBatters[i].ftPctRank,
    //                             fg3mRank: mlbSeasonBatters[i].fg3mRank,
    //                             rebRank: mlbSeasonBatters[i].rebRank,
    //                             astRank: mlbSeasonBatters[i].astRank,
    //                             tovRank: mlbSeasonBatters[i].tovRank,
    //                             stlRank: mlbSeasonBatters[i].stlRank,
    //                             blkRank: mlbSeasonBatters[i].blkRank,
    //                             ptsRank: mlbSeasonBatters[i].ptsRank,
    //                             ftaRank: mlbSeasonBatters[i].ftaRank,
    //                             fgaRank: mlbSeasonBatters[i].ftaRank,
    //                             ftRating: mlbSeasonBatters[i].ftRating,
    //                             fgRating: mlbSeasonBatters[i].fgRating,
    //                             ptsRating: mlbSeasonBatters[i].ptsRating,
    //                             threeRating: mlbSeasonBatters[i].threeRating,
    //                             rebRating: mlbSeasonBatters[i].rebRating,
    //                             astRating: mlbSeasonBatters[i].astRating,
    //                             stlRating: mlbSeasonBatters[i].stlRating,
    //                             blkRating: mlbSeasonBatters[i].blkRating,
    //                             toRating: mlbSeasonBatters[i].toRating,
    //                             ftaRating: mlbSeasonBatters[i].ftaRating,
    //                             fgaRating: mlbSeasonBatters[i].fgaRating,
    //                             ftMixedRating: mlbSeasonBatters[i].ftMixedRating,
    //                             fgMixedRating: mlbSeasonBatters[i].fgMixedRating,
    //                             overallRating: mlbSeasonBatters[i].overallRating,
    //                             overallRank: playerRank
    //                         });
    //                         playerRank++
    //                     }
    //                 }
    //                 callback()
    //             },
    //             two: function (callback) {
    //                 mlbRecentBatters.sort((a, b) => Number(b.overallRating) - Number(a.overallRating));

    //                 playerRank = 1;

    //                 for (var i = 0; i < mlbRecentBatters.length; i++) {
    //                     if (mlbRecentBatters[i].gpRank < 350) {
    //                         PlayerRecentData.create({
    //                             playerId: mlbRecentBatters[i].playerId,
    //                             playerName: mlbRecentBatters[i].playerName,
    //                             teamId: mlbRecentBatters[i].teamId,
    //                             teamAbbreviation: mlbRecentBatters[i].teamAbbreviation,
    //                             min: mlbRecentBatters[i].min,
    //                             fgPct: mlbRecentBatters[i].fgPct,
    //                             ftPct: mlbRecentBatters[i].ftPct,
    //                             fG3M: mlbRecentBatters[i].fG3M,
    //                             reb: mlbRecentBatters[i].reb,
    //                             ast: mlbRecentBatters[i].ast,
    //                             tov: mlbRecentBatters[i].tov,
    //                             stl: mlbRecentBatters[i].stl,
    //                             blk: mlbRecentBatters[i].blk,
    //                             pts: mlbRecentBatters[i].pts,
    //                             fta: mlbRecentBatters[i].fta,
    //                             fga: mlbRecentBatters[i].fga,
    //                             fgPctRank: mlbRecentBatters[i].fgPctRank,
    //                             ftPctRank: mlbRecentBatters[i].ftPctRank,
    //                             fg3mRank: mlbRecentBatters[i].fg3mRank,
    //                             rebRank: mlbRecentBatters[i].rebRank,
    //                             astRank: mlbRecentBatters[i].astRank,
    //                             tovRank: mlbRecentBatters[i].tovRank,
    //                             stlRank: mlbRecentBatters[i].stlRank,
    //                             blkRank: mlbRecentBatters[i].blkRank,
    //                             ptsRank: mlbRecentBatters[i].ptsRank,
    //                             ftaRank: mlbRecentBatters[i].ftaRank,
    //                             fgaRank: mlbRecentBatters[i].fgaRank,
    //                             ftRating: mlbRecentBatters[i].ftRating,
    //                             fgRating: mlbRecentBatters[i].fgRating,
    //                             ptsRating: mlbRecentBatters[i].ptsRating,
    //                             threeRating: mlbRecentBatters[i].threeRating,
    //                             rebRating: mlbRecentBatters[i].rebRating,
    //                             astRating: mlbRecentBatters[i].astRating,
    //                             stlRating: mlbRecentBatters[i].stlRating,
    //                             blkRating: mlbRecentBatters[i].blkRating,
    //                             toRating: mlbRecentBatters[i].toRating,
    //                             ftaRating: mlbRecentBatters[i].ftaRating,
    //                             fgaRating: mlbRecentBatters[i].fgaRating,
    //                             ftMixedRating: mlbRecentBatters[i].ftMixedRating,
    //                             fgMixedRating: mlbRecentBatters[i].fgMixedRating,
    //                             overallRating: mlbRecentBatters[i].overallRating,
    //                             overallRank: playerRank
    //                         });
    //                         playerRank++
    //                     }

    //                 }
    //                 callback()
    //             }
    //         }, function (err, results) {
    //             //Here put the creation of the standard deviations and stuff and making the rankings prob
    //             PlayerSeasonData.find({}, function (err, players) {
    //                 if (err) {
    //                     res.send(err);
    //                 }
    //             });
    //         });
    //     })
    // })
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