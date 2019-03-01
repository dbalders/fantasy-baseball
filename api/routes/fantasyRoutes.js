'use strict';

module.exports = function (app) {
    var fantasy = require('../controllers/fantasyController');

    // app.route('/api/season')
    // 	.get(fantasy.list_all_players)
    // 	// .post(fantasy.get_all_bets)
    // 	// .delete(fantasy.delete_all_bets);

    app.route('/api/players/:leagueId')
        .get(fantasy.list_all_players)

    app.route('/api/teams/:leagueId')
        .get(fantasy.list_teams)

    app.route('/api/teams/:leagueId/:teamKey')
        .get(fantasy.list_teams_players)

    app.route('/api/rankings/season/')
        .get(fantasy.list_season_rankings)

    app.route('/api/rankings/recent/')
        .get(fantasy.list_recent_rankings)

    app.route('/api/rankings/bbm/season/')
        .get(fantasy.list_season_bbm_rankings)

    app.route('/api/rankings/bbm/recent/')
        .get(fantasy.list_recent_bbm_rankings)

    app.route('/api/get_rankings')
        .get(fantasy.get_rankings)

    app.route('/api/targets/season/:leagueId')
        .get(fantasy.list_season_pickups)

    app.route('/api/targets/recent/:leagueId')
        .get(fantasy.list_recent_pickups)

    app.route('/api/targets/bbm/season/:leagueId')
        .get(fantasy.list_season_bbm_pickups)

    app.route('/api/targets/bbm/recent/:leagueId')
        .get(fantasy.list_recent_bbm_pickups)

    app.route('/api/espn/league/:espnId')
        .get(fantasy.get_espn_data)

    app.route('/api/erase')
        .get(fantasy.erase_current_data)

    app.route('/api/refresh_yahoo_data')
        .get(fantasy.refresh_yahoo_data)

    app.route('/api/player_data/season/')
        .get(fantasy.get_player_season_data)

    app.route('/api/player_data/recent/')
        .get(fantasy.get_player_recent_data)

    app.route('/api/payment/espn/:espnLeagueId/:espnTeamId')
        .post(fantasy.create_espn_user)
        .get(fantasy.create_espn_user)

    app.route('/api/payment')
        .get(fantasy.payment_get)
        .post(fantasy.payment_post)
};