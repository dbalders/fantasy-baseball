'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayersSchema = new Schema({
    leagueId: {
        type: Number
    },
    fullName: {
        type: String
    },
    rank: {
        type: Number
    }
});

var PlayersSchema = new Schema({
    leagueId: {
        type: String
    },
    players: {
        type: Array
    }
});

var TeamsSchema = new Schema({
    leagueId: {
        type: String
    },
    teams: {
        type: Array
    }
});

var ScoringSchema = new Schema({
    leagueId: {
        type: String
    },
    scoring: {
        type: Array
    }
});

var BBMRankingsSeasonSchema = new Schema({
    playerId: Number,
    playerName: String,
    playerType: String,
    teamId: Number,
    team: String,
    games: Number,
    pos: String,
    inj: String,
    ab: Number,
    hit: Number,
    double: Number,
    triple: Number,
    homeRun: Number,
    run: Number,
    rbi: Number,
    walk: Number,
    xbh: Number,
    sb: Number,
    avg: Number,
    obp: Number,
    slg: Number,
    ops: Number,
    gamesRating: Number,
    abRating: Number,
    hitRating: Number,
    doubleRating: Number,
    tripleRating: Number,
    homeRunRating: Number,
    runRating: Number,
    rbiRating: Number,
    walkRating: Number,
    xbhRating: Number,
    sbRating: Number,
    avgRating: Number,
    obpRating: Number,
    slgRating: Number,
    opsRating: Number,
    win: Number,
    era: Number,
    whip: Number,
    ip: Number,
    ra: Number,
    sv: Number,
    k: Number,
    hold: Number,
    savehold: Number,
    k9: Number,
    qs: Number,
    winRating: Number,
    eraRating: Number,
    whipRating: Number,
    ipRating: Number,
    raRating: Number,
    svRating: Number,
    kRating: Number,
    holdRating: Number,
    saveholdRating: Number,
    k9Rating: Number,
    qsRating: Number,
    overallRating: Number,
    overallRank: Number
});

var BBMRankingsRecentSchema = new Schema({
    playerId: Number,
    playerName: String,
    playerType: String,
    teamId: Number,
    team: String,
    games: Number,
    pos: String,
    inj: String,
    ab: Number,
    hit: Number,
    double: Number,
    triple: Number,
    homeRun: Number,
    run: Number,
    rbi: Number,
    walk: Number,
    xbh: Number,
    sb: Number,
    avg: Number,
    obp: Number,
    slg: Number,
    ops: Number,
    gamesRating: Number,
    abRating: Number,
    hitRating: Number,
    doubleRating: Number,
    tripleRating: Number,
    homeRunRating: Number,
    runRating: Number,
    rbiRating: Number,
    walkRating: Number,
    xbhRating: Number,
    sbRating: Number,
    avgRating: Number,
    obpRating: Number,
    slgRating: Number,
    opsRating: Number,
    win: Number,
    era: Number,
    whip: Number,
    ip: Number,
    ra: Number,
    sv: Number,
    k: Number,
    hold: Number,
    savehold: Number,
    k9: Number,
    qs: Number,
    winRating: Number,
    eraRating: Number,
    whipRating: Number,
    ipRating: Number,
    raRating: Number,
    svRating: Number,
    kRating: Number,
    holdRating: Number,
    saveholdRating: Number,
    k9Rating: Number,
    qsRating: Number,
    overallRating: Number,
    overallRank: Number
});

var PickupTargetsSeasonSchema = new Schema({
    leagueId: {
        type: String
    },
    players: {
        type: Array
    }
});

var PickupTargetsRecentSchema = new Schema({
    leagueId: {
        type: String
    },
    players: {
        type: Array
    }
});

var BBMPickupTargetsSeasonSchema = new Schema({
    leagueId: {
        type: String
    },
    players: {
        type: Array
    }
});

var BBMPickupTargetsRecentSchema = new Schema({
    leagueId: {
        type: String
    },
    players: {
        type: Array
    }
});

var PlayerSeasonDataSchema = new Schema({
    playerId: Number,
    playerName: String,
    playerType: String,
    teamId: Number,
    team: String,
    games: Number,
    pos: String,
    inj: String,
    ab: Number,
    hit: Number,
    double: Number,
    triple: Number,
    homeRun: Number,
    run: Number,
    rbi: Number,
    walk: Number,
    xbh: Number,
    sb: Number,
    avg: Number,
    obp: Number,
    slg: Number,
    ops: Number,
    gamesRating: Number,
    abRating: Number,
    hitRating: Number,
    doubleRating: Number,
    tripleRating: Number,
    homeRunRating: Number,
    runRating: Number,
    rbiRating: Number,
    walkRating: Number,
    xbhRating: Number,
    sbRating: Number,
    avgRating: Number,
    obpRating: Number,
    slgRating: Number,
    opsRating: Number,
    win: Number,
    era: Number,
    whip: Number,
    ip: Number,
    ra: Number,
    sv: Number,
    k: Number,
    hold: Number,
    savehold: Number,
    k9: Number,
    qs: Number,
    winRating: Number,
    eraRating: Number,
    whipRating: Number,
    ipRating: Number,
    raRating: Number,
    svRating: Number,
    kRating: Number,
    holdRating: Number,
    saveholdRating: Number,
    k9Rating: Number,
    qsRating: Number,
    overallRating: Number,
    overallRank: Number
})

var PlayerRecentDataSchema = new Schema({
    playerId: Number,
    playerName: String,
    playerType: String,
    teamId: Number,
    team: String,
    games: Number,
    pos: String,
    inj: String,
    ab: Number,
    hit: Number,
    double: Number,
    triple: Number,
    homeRun: Number,
    run: Number,
    rbi: Number,
    walk: Number,
    xbh: Number,
    sb: Number,
    avg: Number,
    obp: Number,
    slg: Number,
    ops: Number,
    gamesRating: Number,
    abRating: Number,
    hitRating: Number,
    doubleRating: Number,
    tripleRating: Number,
    homeRunRating: Number,
    runRating: Number,
    rbiRating: Number,
    walkRating: Number,
    xbhRating: Number,
    sbRating: Number,
    avgRating: Number,
    obpRating: Number,
    slgRating: Number,
    opsRating: Number,
    win: Number,
    era: Number,
    whip: Number,
    ip: Number,
    ra: Number,
    sv: Number,
    k: Number,
    hold: Number,
    savehold: Number,
    k9: Number,
    qs: Number,
    winRating: Number,
    eraRating: Number,
    whipRating: Number,
    ipRating: Number,
    raRating: Number,
    svRating: Number,
    kRating: Number,
    holdRating: Number,
    saveholdRating: Number,
    k9Rating: Number,
    qsRating: Number,
    overallRating: Number,
    overallRank: Number
})

var PaymentSchema = new Schema ({
    yahooEmail: String,
    email: String,
    leagues: Array,
    paid: Boolean,
    paymentDate: Date,
    paymentAmount: Number,
    seasonId: Number,
    espnTeamId: Number,
    espnLeagueId: Number
})

module.exports = mongoose.model('Players', PlayersSchema);
module.exports = mongoose.model('Teams', TeamsSchema);
module.exports = mongoose.model('Scoring', ScoringSchema);
module.exports = mongoose.model('BBMRankingsSeason', BBMRankingsSeasonSchema);
module.exports = mongoose.model('BBMRankingsRecent', BBMRankingsRecentSchema);
module.exports = mongoose.model('PickupTargetsSeason', PickupTargetsSeasonSchema);
module.exports = mongoose.model('PickupTargetsRecent', PickupTargetsRecentSchema);
module.exports = mongoose.model('BBMPickupTargetsSeason', BBMPickupTargetsSeasonSchema);
module.exports = mongoose.model('BBMPickupTargetsRecent', BBMPickupTargetsRecentSchema);
module.exports = mongoose.model('PlayerSeasonData', PlayerSeasonDataSchema);
module.exports = mongoose.model('PlayerRecentData', PlayerRecentDataSchema);
module.exports = mongoose.model('Payment', PaymentSchema);