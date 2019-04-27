var request = require("request"),
    async = require("async"),
    fs = require('fs-then');

var mongoose = require('mongoose'),
    PlayerSeasonData = mongoose.model('PlayerSeasonData'),
    PlayerRecentData = mongoose.model('PlayerRecentData')

exports.getRankings = function (req, res) {

    var playerRankings = [];
    var playerRankingsRecent = [];
    var mlbSeasonRankings = [];
    var mlbRecentRankings = [];

    PlayerSeasonData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });
    PlayerRecentData.remove({}, function (err, task) {
        if (err)
            res.send(err);
    });

    fs.readFile('./public/json/rankings.json', (err, data) => {
        if (err) throw err;

        let playerRankings = JSON.parse(data);

        for (var i = 0; i < playerRankings.length; i++) {
            if (playerRankings[i].playerType === "Batter") {
                if (playerRankings[i].g > 0) {
                    PlayerSeasonData.create({
                        playerName: playerRankings[i].Name,
                        playerType: playerRankings[i].playerType,
                        team: playerRankings[i].Team,
                        games: playerRankings[i].g,
                        hit: playerRankings[i].H,
                        double: playerRankings[i]['2B'],
                        triple: playerRankings[i]['3B'],
                        homeRun: playerRankings[i].HR,
                        run: playerRankings[i].R,
                        rbi: playerRankings[i].RBI,
                        walk: playerRankings[i].BB,
                        sb: playerRankings[i].SB,
                        avg: playerRankings[i].BA,
                        obp: playerRankings[i].OBP,
                        slg: playerRankings[i].SLG,
                        ops: playerRankings[i].OPS,
                        gamesRating: playerRankings[i].GV,
                        hitRating: playerRankings[i].HV,
                        doubleRating: playerRankings[i]['2BV'],
                        tripleRating: playerRankings[i]['3BV'],
                        homeRunRating: playerRankings[i].HRV,
                        runRating: playerRankings[i].RV,
                        rbiRating: playerRankings[i].RBIV,
                        walkRating: playerRankings[i].BBV,
                        sbRating: playerRankings[i].SBV,
                        avgRating: playerRankings[i].BAV,
                        obpRating: playerRankings[i].OBPV,
                        slgRating: playerRankings[i].SLGV,
                        opsRating: playerRankings[i].OPSV,
    
                        win: 0,
                        era: 0,
                        whip: 0,
                        ip: 0,
                        sv: 0,
                        k: 0,
                        hold: 0,
                        savehold: 0,
                        k9: 0,
                        qs: 0,
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
                        qsRating: 0,
    
                        overallRating: playerRankings[i].Value,
                        overallRank: playerRankings[i].Rank
                    });
                }
            } else {
                if (playerRankings[i].IP > 0) {
                    PlayerSeasonData.create({
                        playerName: playerRankings[i].Name,
                        playerType: playerRankings[i].playerType,
                        team: playerRankings[i].Team,
                        games: playerRankings[i].g,
                        hit: 0,
                        double: 0,
                        triple: 0,
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
                        tripleRating: 0,
                        homeRunRating: 0,
                        runRating: 0,
                        rbiRating: 0,
                        walkRating: 0,
                        sbRating: 0,
                        avgRating: 0,
                        obpRating: 0,
                        slgRating: 0,
                        opsRating: 0,
    
                        win: playerRankings[i].W,
                        era: playerRankings[i].ERA,
                        whip: playerRankings[i].WHIP,
                        ip: playerRankings[i].IP,
                        sv: playerRankings[i].SV,
                        k: playerRankings[i].SO,
                        hold: playerRankings[i].HLD,
                        savehold: playerRankings[i].SnH,
                        k9: playerRankings[i]["K/9"],
                        qs: playerRankings[i].QS,
                        gamesRating: playerRankings[i].GV,
                        winRating: playerRankings[i].WV,
                        eraRating: playerRankings[i].ERAV,
                        whipRating: playerRankings[i].WHIPV,
                        ipRating: playerRankings[i].IPV,
                        svRating: playerRankings[i].SVV,
                        kRating: playerRankings[i].SOV,
                        holdRating: playerRankings[i].HLDV,
                        saveholdRating: playerRankings[i].SnHV,
                        k9Rating: playerRankings[i]["K/9V"],
                        qsRating: playerRankings[i].QSV,
    
                        overallRating: playerRankings[i].Value,
                        overallRank: playerRankings[i].Rank
                    });
                }
            }       
        }
    });

    fs.readFile('./public/json/rankings_recent.json', (err, data) => {
        if (err) throw err;
        
        let playerRankingsRecent = JSON.parse(data);

        for (var j = 0; j < playerRankingsRecent.length; j++) {
            if (playerRankingsRecent[j].playerType === "Batter") {
                if (playerRankingsRecent[j].g > 0) {
                    PlayerRecentData.create({
                        playerName: playerRankingsRecent[j].Name,
                        playerType: playerRankingsRecent[j].playerType,
                        team: playerRankingsRecent[j].Team,
                        games: playerRankingsRecent[j].g,
                        hit: playerRankingsRecent[j].H,
                        double: playerRankingsRecent[j]['2B'],
                        triple: playerRankingsRecent[j]['3B'],
                        homeRun: playerRankingsRecent[j].HR,
                        run: playerRankingsRecent[j].R,
                        rbi: playerRankingsRecent[j].RBI,
                        walk: playerRankingsRecent[j].BB,
                        sb: playerRankingsRecent[j].SB,
                        avg: playerRankingsRecent[j].BA,
                        obp: playerRankingsRecent[j].OBP,
                        slg: playerRankingsRecent[j].SLG,
                        ops: playerRankingsRecent[j].OPS,
                        gamesRating: playerRankingsRecent[j].GV,
                        hitRating: playerRankingsRecent[j].HV,
                        doubleRating: playerRankingsRecent[j]['2BV'],
                        tripleRating: playerRankingsRecent[j]['3BV'],
                        homeRunRating: playerRankingsRecent[j].HRV,
                        runRating: playerRankingsRecent[j].RV,
                        rbiRating: playerRankingsRecent[j].RBIV,
                        walkRating: playerRankingsRecent[j].BBV,
                        sbRating: playerRankingsRecent[j].SBV,
                        avgRating: playerRankingsRecent[j].BAV,
                        obpRating: playerRankingsRecent[j].OBPV,
                        slgRating: playerRankingsRecent[j].SLGV,
                        opsRating: playerRankingsRecent[j].OPSV,
    
                        win: 0,
                        era: 0,
                        whip: 0,
                        ip: 0,
                        sv: 0,
                        k: 0,
                        hold: 0,
                        savehold: 0,
                        k9: 0,
                        qs: 0,
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
                        qsRating: 0,
    
                        overallRating: playerRankingsRecent[j].Value,
                        overallRank: playerRankingsRecent[j].Rank
                    });
                }
            } else {
                if (playerRankingsRecent[j].IP > 0) {
                    PlayerRecentData.create({
                        playerName: playerRankingsRecent[j].Name,
                        playerType: playerRankingsRecent[j].playerType,
                        team: playerRankingsRecent[j].Team,
                        games: playerRankingsRecent[j].g,
                        hit: 0,
                        double: 0,
                        triple: 0,
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
                        tripleRating: 0,
                        homeRunRating: 0,
                        runRating: 0,
                        rbiRating: 0,
                        walkRating: 0,
                        sbRating: 0,
                        avgRating: 0,
                        obpRating: 0,
                        slgRating: 0,
                        opsRating: 0,
    
                        win: playerRankingsRecent[j].W,
                        era: playerRankingsRecent[j].ERA,
                        whip: playerRankingsRecent[j].WHIP,
                        ip: playerRankingsRecent[j].IP,
                        sv: playerRankingsRecent[j].SV,
                        k: playerRankingsRecent[j].SO,
                        hold: playerRankingsRecent[j].HLD,
                        savehold: playerRankingsRecent[j].SnH,
                        k9: playerRankingsRecent[j]["K/9"],
                        qs: playerRankingsRecent[j].QS,
                        gamesRating: playerRankingsRecent[j].GV,
                        winRating: playerRankingsRecent[j].WV,
                        eraRating: playerRankingsRecent[j].ERAV,
                        whipRating: playerRankingsRecent[j].WHIPV,
                        ipRating: playerRankingsRecent[j].IPV,
                        svRating: playerRankingsRecent[j].SVV,
                        kRating: playerRankingsRecent[j].SOV,
                        holdRating: playerRankingsRecent[j].HLDV,
                        saveholdRating: playerRankingsRecent[j].SnHV,
                        k9Rating: playerRankingsRecent[j]["K/9V"],
                        qsRating: playerRankingsRecent[j].QSV,
    
                        overallRating: playerRankingsRecent[j].Value,
                        overallRank: playerRankingsRecent[j].Rank
                    });
                }
            }       
        }
    });
}