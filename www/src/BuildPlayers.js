import React, { Component } from 'react';
import Cookies from 'js-cookie';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import stringSimilarity from 'string-similarity';
import { CompareTeams } from './CompareTeams';
import { callApi } from './CallApi';
import ReactGA from 'react-ga';
import Select from 'react-select';

export class BuildPlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerTargetsRecent: [],
            playerTargetsSeason: [],
            playerTargetsLocalRecent: [],
            playerTargetsLocalSeason: [],
            playerTargetsBBMRecent: [],
            playerTargetsBBMSeason: [],
            teamPlayers: [],
            playerRankingsSeason: [],
            playerRankingsRecent: [],
            playerRankingsLocalSeason: [],
            playerRankingsLocalRecent: [],
            playerRankingsBBMSeason: [],
            playerRankingsBBMRecent: [],
            teamStatsSeason: [],
            teamStatsRecent: [],
            teamStatsSeasonAvg: [],
            teamStatsRecentAvg: [],
            playerPickupsSeason: [],
            playerPickupsRecent: [],
            teams: [],
            teamSelected: null,
            leagueId: null,
            showBBMStats: false,
            showRecentRankings: false,
            statsHeaders: [],
            updateCompareTable: false,
            drafted: true,
            leagueScoring: [],
            posSelected: "All"
        }
        this.changeStats = this.changeStats.bind(this);
        this.changeRankings = this.changeRankings.bind(this);
        this.statExist = this.statExist.bind(this);
    }

    componentDidMount() {
        ReactGA.initialize('UA-135378238-2');
        ReactGA.pageview("/?logged-in=true");
        //Grab team and league ID from cookies
        var leagueId = Cookies.get('leagueId');
        var teamId = Cookies.get('teamId');
        var today = new Date();
        var expireDate = Cookies.get('dataExpireDate');
        var allData = true;

        //Go through each local storage needed and if they dont exist, just refresh all data
        if (!(JSON.parse(localStorage.getItem('playerTargetsLocalRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerTargetsRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerTargetsLocalSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerTargetsSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsLocalSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsLocalRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('teams')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('leagueScoring')))) allData = false;
        // if (!(JSON.parse(localStorage.getItem('playerTargetsBBMRecent')))) allData = false;
        // if (!(JSON.parse(localStorage.getItem('playerTargetsBBMSeason')))) allData = false;
        // if (!(JSON.parse(localStorage.getItem('playerRankingsBBMRecent')))) allData = false;
        // if (!(JSON.parse(localStorage.getItem('playerRankingsBBMSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('teamPlayers')))) allData = false;

        if (leagueId) {
            this.setState({ leagueId: leagueId });

            //If it is greater or equal to the day after the last time they got data, expire doesn't exist, or dont have all data, update all
            if ((today >= expireDate) || (expireDate === undefined) || allData === false) {

                var expireDate = new Date();
                expireDate.setDate(today.getDate());

                //Get all the league info from each api endpoint
                callApi('/api/rankings/season/')
                    .then(results => {
                        var playerData = results;
                        this.setState({ playerRankingsSeason: playerData });
                        localStorage.setItem('playerRankingsSeason', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                callApi('/api/rankings/recent/')
                    .then(results => {
                        var playerData = results;
                        this.setState({ playerRankingsRecent: playerData });
                        localStorage.setItem('playerRankingsRecent', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                callApi('/api/targets/recent/' + leagueId)
                    .then(results => {
                        var playerData = results[0].players;
                        this.setState({
                            playerTargetsLocalRecent: playerData,
                            playerTargetsRecent: playerData
                        });
                        localStorage.setItem('playerTargetsLocalRecent', JSON.stringify(playerData));
                        localStorage.setItem('playerTargetsRecent', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //Targets from season ranking
                callApi('/api/targets/season/' + leagueId)
                    .then(results => {
                        var playerData = results[0].players;
                        this.setState({
                            playerTargetsLocalSeason: playerData,
                            playerTargetsSeason: playerData
                        });
                        localStorage.setItem('playerTargetsLocalSeason', JSON.stringify(playerData));
                        localStorage.setItem('playerTargetsSeason', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //Local rankings for the season
                // callApi('/api/player_data/season/')
                //     .then(results => {
                //         var playerData = results;
                //         this.setState({
                //             playerRankingsLocalSeason: playerData,
                //             playerRankingsSeason: playerData
                //         });
                //         localStorage.setItem('playerRankingsLocalSeason', JSON.stringify(playerData));
                //         localStorage.setItem('playerRankingsSeason', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                //Local rankings for recent
                // callApi('/api/player_data/recent/')
                //     .then(results => {
                //         var playerData = results;
                //         this.setState({
                //             playerRankingsLocalRecent: playerData,
                //             playerRankingsRecent: playerData
                //         });
                //         localStorage.setItem('playerRankingsLocalRecent', JSON.stringify(playerData));
                //         localStorage.setItem('playerRankingsRecent', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                //List of the teams in the league
                callApi('/api/teams/' + leagueId)
                    .then(results => {
                        var teams = results[0].teams;
                        this.setState({ teams: teams });
                        localStorage.setItem('teams', JSON.stringify(teams));
                    })
                    .catch(err => console.log(err));

                callApi('/api/scoring/' + leagueId)
                    .then(results => {
                        var leagueScoring = results[0].scoring;
                        this.setState({ leagueScoring: leagueScoring });
                        localStorage.setItem('leagueScoring', JSON.stringify(leagueScoring));
                    })
                    .catch(err => console.log(err));

                // //BBM targets recent
                // callApi('/api/targets/bbm/recent/' + leagueId)
                //     .then(results => {
                //         var playerData = results[0].players;
                //         this.setState({ playerTargetsBBMRecent: playerData });
                //         localStorage.setItem('playerTargetsBBMRecent', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                // //BBM targets season
                // callApi('/api/targets/bbm/season/' + leagueId)
                //     .then(results => {
                //         var playerData = results[0].players;
                //         this.setState({ playerTargetsBBMSeason: playerData });
                //         localStorage.setItem('playerTargetsBBMSeason', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                // //BBM rankings season
                // callApi('/api/rankings/bbm/season/')
                //     .then(results => {
                //         var playerData = results;
                //         this.setState({ playerRankingsBBMSeason: playerData });
                //         localStorage.setItem('playerRankingsBBMSeason', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                // //BBM rankings recent
                // callApi('/api/rankings/bbm/recent/')
                //     .then(results => {
                //         var playerData = results;
                //         this.setState({ playerRankingsBBMRecent: playerData });
                //         localStorage.setItem('playerRankingsBBMRecent', JSON.stringify(playerData));
                //     })
                //     .catch(err => console.log(err));

                if (teamId) {
                    //Their team data
                    callApi('/api/teams/' + leagueId + '/' + teamId)
                        .then(results => {
                            var playerData = results;
                            if (playerData.length === 0) {
                                this.setState({ drafted: false })
                            } else {
                                //check if the data is there, and if not, add a 1 sec wait then send to the build function
                                if (this.state.playerRankingsSeason.length === 0 || this.state.playerRankingsRecent.length === 0) {
                                    setTimeout(function () {
                                        if (this.state.playerRankingsSeason.length === 0 || this.state.playerRankingsRecent.length === 0) {
                                            setTimeout(function () {
                                                localStorage.setItem('teamPlayers', JSON.stringify(playerData));
                                                Cookies.set('dataExpireDate', expireDate)
                                                this.setState({ teamPlayers: playerData }, this.orderRankings);
                                            }.bind(this), 2000)
                                        } else {
                                            localStorage.setItem('teamPlayers', JSON.stringify(playerData));
                                            this.setState({ teamPlayers: playerData }, this.orderRankings);
                                        }
                                    }.bind(this), 2000)
                                } else {
                                    localStorage.setItem('teamPlayers', JSON.stringify(playerData));
                                    this.setState({ teamPlayers: playerData }, this.orderRankings);
                                }
                            }

                        })
                        .catch(err => {
                            console.log(err)
                            this.setState({ drafted: false })
                        });
                }
            } else {
                //If it is the same day, then just load all the data from local storage
                this.setState({
                    playerTargetsLocalRecent: JSON.parse(localStorage.getItem('playerTargetsLocalRecent')),
                    playerTargetsRecent: JSON.parse(localStorage.getItem('playerTargetsRecent')),
                    playerTargetsLocalSeason: JSON.parse(localStorage.getItem('playerTargetsLocalSeason')),
                    playerTargetsSeason: JSON.parse(localStorage.getItem('playerTargetsSeason')),
                    playerRankingsLocalSeason: JSON.parse(localStorage.getItem('playerRankingsLocalSeason')),
                    playerRankingsSeason: JSON.parse(localStorage.getItem('playerRankingsSeason')),
                    playerRankingsLocalRecent: JSON.parse(localStorage.getItem('playerRankingsLocalRecent')),
                    playerRankingsRecent: JSON.parse(localStorage.getItem('playerRankingsRecent')),
                    teams: JSON.parse(localStorage.getItem('teams')),
                    playerTargetsBBMRecent: JSON.parse(localStorage.getItem('playerTargetsBBMRecent')),
                    playerTargetsBBMSeason: JSON.parse(localStorage.getItem('playerTargetsBBMSeason')),
                    playerRankingsBBMSeason: JSON.parse(localStorage.getItem('playerRankingsBBMSeason')),
                    playerRankingsBBMRecent: JSON.parse(localStorage.getItem('playerRankingsBBMRecent')),
                    teamPlayers: JSON.parse(localStorage.getItem('teamPlayers'))
                }, this.orderRankings());
            }

        }
    }

    changeStats() {
        //Toggle the state to show BBM stats or local
        this.setState({ showBBMStats: !this.state.showBBMStats }, () => {
            //If BBM stats is true, load in their data
            if (this.state.showBBMStats) {
                this.setState({
                    playerTargetsSeason: this.state.playerTargetsBBMRecent,
                    playerTargetsRecent: this.state.playerTargetsBBMSeason,
                    playerRankingsSeason: this.state.playerRankingsBBMSeason,
                    playerRankingsRecent: this.state.playerRankingsBBMRecent,
                    updateCompareTable: true
                }, function () {
                    //Rebuild page with new data
                    this.buildTeam()
                    //set this state back to false to stop the constant re-render of compare table
                    this.setState({ updateCompareTable: false })
                })
            } else {
                //If local stats is true, load the local data
                this.setState({
                    playerTargetsSeason: this.state.playerTargetsLocalRecent,
                    playerTargetsRecent: this.state.playerTargetsLocalSeason,
                    playerRankingsSeason: this.state.playerRankingsLocalSeason,
                    playerRankingsRecent: this.state.playerRankingsLocalRecent,
                    updateCompareTable: true
                }, function () {
                    //Rebuild Team with new data
                    this.buildTeam();
                    //set this state back to false to stop the constant re-render of compare table
                    this.setState({ updateCompareTable: false })
                })
            }

        })
    }

    changeRankings() {
        this.setState({ showRecentRankings: !this.state.showRecentRankings })
    }

    buildTeam() {
        var teamStatsSeason = [];
        var teamStatsRecent = [];
        var teamStatsSeasonAvg = [];
        var teamStatsRecentAvg = [];
        var teamPickupsSeason = [];
        var teamPickupsRecent = [];
        var teamPlayers = this.state.teamPlayers;

        var playerRankingsSeason = this.state.playerRankingsSeason;
        var playerRankingsRecent = this.state.playerRankingsRecent;
        var playerPickupsSeason = this.state.playerTargetsSeason;
        var playerPickupsRecent = this.state.playerTargetsRecent;
        var batterLength = 0;
        var pitcherLength = 0;

        //for each player on the team, if string similarity > .7 in the player rankings, then add that player to the array
        for (var i = 0; i < teamPlayers.length; i++) {
            for (var j = 0; j < playerRankingsSeason.length; j++) {

                var similarPlayerSeason = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsSeason[j].playerName);
                if (similarPlayerSeason > 0.7) {

                    //Push the player to the team array
                    teamStatsSeason.push(playerRankingsSeason[j]);

                    if (playerRankingsSeason[j].playerType === "Batter") {
                        batterLength++;
                    } else {
                        pitcherLength++;
                    }
                    //Start calculating averages by adding them all up
                    var avgRating = (playerRankingsSeason[j].avgRating) ? (playerRankingsSeason[j].avgRating) : 0;
                    var runRating = (playerRankingsSeason[j].runRating) ? (playerRankingsSeason[j].runRating) : 0;
                    var rbiRating = (playerRankingsSeason[j].rbiRating) ? (playerRankingsSeason[j].rbiRating) : 0;
                    var homeRunRating = (playerRankingsSeason[j].homeRunRating) ? (playerRankingsSeason[j].homeRunRating) : 0;
                    var sbRating = (playerRankingsSeason[j].sbRating) ? (playerRankingsSeason[j].sbRating) : 0;
                    var obpRating = (playerRankingsSeason[j].obpRating) ? (playerRankingsSeason[j].obpRating) : 0;
                    var slgRating = (playerRankingsSeason[j].slgRating) ? (playerRankingsSeason[j].slgRating) : 0;
                    var doubleRating = (playerRankingsSeason[j].doubleRating) ? (playerRankingsSeason[j].doubleRating) : 0;
                    var walkRating = (playerRankingsSeason[j].walkRating) ? (playerRankingsSeason[j].walkRating) : 0;
                    var opsRating = (playerRankingsSeason[j].opsRating) ? (playerRankingsSeason[j].opsRating) : 0;
                    var winRating = (playerRankingsSeason[j].winRating) ? (playerRankingsSeason[j].winRating) : 0;
                    var eraRating = (playerRankingsSeason[j].eraRating) ? (playerRankingsSeason[j].eraRating) : 0;
                    var whipRating = (playerRankingsSeason[j].whipRating) ? (playerRankingsSeason[j].whipRating) : 0;
                    var ipRating = (playerRankingsSeason[j].ipRating) ? (playerRankingsSeason[j].ipRating) : 0;
                    var svRating = (playerRankingsSeason[j].svRating) ? (playerRankingsSeason[j].svRating) : 0;
                    var kRating = (playerRankingsSeason[j].kRating) ? (playerRankingsSeason[j].kRating) : 0;
                    var holdRating = (playerRankingsSeason[j].holdRating) ? (playerRankingsSeason[j].holdRating) : 0;
                    var saveholdRating = (playerRankingsSeason[j].saveholdRating) ? (playerRankingsSeason[j].saveholdRating) : 0;
                    var k9Rating = (playerRankingsSeason[j].k9Rating) ? (playerRankingsSeason[j].k9Rating) : 0;
                    var qsRating = (playerRankingsSeason[j].qsRating) ? (playerRankingsSeason[j].qsRating) : 0;

                    teamStatsSeasonAvg = {
                        overallRating: (teamStatsSeasonAvg.overallRating) ? (teamStatsSeasonAvg.overallRating + playerRankingsSeason[j].overallRating) : playerRankingsSeason[j].overallRating,
                        avgRating: (teamStatsSeasonAvg.avgRating) ? (teamStatsSeasonAvg.avgRating + avgRating) : avgRating,
                        runRating: (teamStatsSeasonAvg.runRating) ? (teamStatsSeasonAvg.runRating + runRating) : runRating,
                        rbiRating: (teamStatsSeasonAvg.rbiRating) ? (teamStatsSeasonAvg.rbiRating + rbiRating) : rbiRating,
                        homeRunRating: (teamStatsSeasonAvg.homeRunRating) ? (teamStatsSeasonAvg.homeRunRating + homeRunRating) : homeRunRating,
                        sbRating: (teamStatsSeasonAvg.sbRating) ? (teamStatsSeasonAvg.sbRating + sbRating) : sbRating,
                        obpRating: (teamStatsSeasonAvg.obpRating) ? (teamStatsSeasonAvg.obpRating + obpRating) : obpRating,
                        slgRating: (teamStatsSeasonAvg.slgRating) ? (teamStatsSeasonAvg.slgRating + slgRating) : slgRating,
                        doubleRating: (teamStatsSeasonAvg.doubleRating) ? (teamStatsSeasonAvg.doubleRating + doubleRating) : doubleRating,
                        walkRating: (teamStatsSeasonAvg.walkRating) ? (teamStatsSeasonAvg.walkRating + walkRating) : walkRating,
                        opsRating: (teamStatsSeasonAvg.opsRating) ? (teamStatsSeasonAvg.opsRating + opsRating) : opsRating,
                        winRating: (teamStatsSeasonAvg.winRating) ? (teamStatsSeasonAvg.winRating + winRating) : winRating,
                        eraRating: (teamStatsSeasonAvg.eraRating) ? (teamStatsSeasonAvg.eraRating + eraRating) : eraRating,
                        whipRating: (teamStatsSeasonAvg.whipRating) ? (teamStatsSeasonAvg.whipRating + whipRating) : whipRating,
                        ipRating: (teamStatsSeasonAvg.ipRating) ? (teamStatsSeasonAvg.ipRating + ipRating) : ipRating,
                        svRating: (teamStatsSeasonAvg.svRating) ? (teamStatsSeasonAvg.svRating + svRating) : svRating,
                        kRating: (teamStatsSeasonAvg.kRating) ? (teamStatsSeasonAvg.kRating + kRating) : kRating,
                        holdRating: (teamStatsSeasonAvg.holdRating) ? (teamStatsSeasonAvg.holdRating + holdRating) : holdRating,
                        saveholdRating: (teamStatsSeasonAvg.saveholdRating) ? (teamStatsSeasonAvg.saveholdRating + saveholdRating) : saveholdRating,
                        k9Rating: (teamStatsSeasonAvg.k9Rating) ? (teamStatsSeasonAvg.k9Rating + k9Rating) : k9Rating,
                        qsRating: (teamStatsSeasonAvg.qsRating) ? (teamStatsSeasonAvg.qsRating + qsRating) : qsRating
                    }
                    break
                }
            }

            //Same here for recent data
            for (j = 0; j < playerRankingsRecent.length; j++) {
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsRecent[j].playerName);
                if (similarPlayerRecent > 0.7) {
                    teamStatsRecent.push(playerRankingsRecent[j]);

                    var avgRating = (playerRankingsRecent[j].avgRating) ? (playerRankingsRecent[j].avgRating) : 0;
                    var runRating = (playerRankingsRecent[j].runRating) ? (playerRankingsRecent[j].runRating) : 0;
                    var rbiRating = (playerRankingsRecent[j].rbiRating) ? (playerRankingsRecent[j].rbiRating) : 0;
                    var homeRunRating = (playerRankingsRecent[j].homeRunRating) ? (playerRankingsRecent[j].homeRunRating) : 0;
                    var sbRating = (playerRankingsRecent[j].sbRating) ? (playerRankingsRecent[j].sbRating) : 0;
                    var obpRating = (playerRankingsRecent[j].obpRating) ? (playerRankingsRecent[j].obpRating) : 0;
                    var slgRating = (playerRankingsRecent[j].slgRating) ? (playerRankingsRecent[j].slgRating) : 0;
                    var doubleRating = (playerRankingsRecent[j].doubleRating) ? (playerRankingsRecent[j].doubleRating) : 0;
                    var walkRating = (playerRankingsRecent[j].walkRating) ? (playerRankingsRecent[j].walkRating) : 0;
                    var opsRating = (playerRankingsRecent[j].opsRating) ? (playerRankingsRecent[j].opsRating) : 0;
                    var winRating = (playerRankingsRecent[j].winRating) ? (playerRankingsRecent[j].winRating) : 0;
                    var eraRating = (playerRankingsRecent[j].eraRating) ? (playerRankingsRecent[j].eraRating) : 0;
                    var whipRating = (playerRankingsRecent[j].whipRating) ? (playerRankingsRecent[j].whipRating) : 0;
                    var ipRating = (playerRankingsRecent[j].ipRating) ? (playerRankingsRecent[j].ipRating) : 0;
                    var svRating = (playerRankingsRecent[j].svRating) ? (playerRankingsRecent[j].svRating) : 0;
                    var kRating = (playerRankingsRecent[j].kRating) ? (playerRankingsRecent[j].kRating) : 0;
                    var holdRating = (playerRankingsRecent[j].holdRating) ? (playerRankingsRecent[j].holdRating) : 0;
                    var saveholdRating = (playerRankingsRecent[j].saveholdRating) ? (playerRankingsRecent[j].saveholdRating) : 0;
                    var k9Rating = (playerRankingsRecent[j].k9Rating) ? (playerRankingsRecent[j].k9Rating) : 0;
                    var qsRating = (playerRankingsRecent[j].qsRating) ? (playerRankingsRecent[j].qsRating) : 0;

                    teamStatsRecentAvg = {
                        overallRating: (teamStatsRecentAvg.overallRating) ? (teamStatsRecentAvg.overallRating + playerRankingsRecent[j].overallRating) : playerRankingsRecent[j].overallRating,
                        avgRating: (teamStatsRecentAvg.avgRating) ? (teamStatsRecentAvg.avgRating + avgRating) : avgRating,
                        runRating: (teamStatsRecentAvg.runRating) ? (teamStatsRecentAvg.runRating + runRating) : runRating,
                        rbiRating: (teamStatsRecentAvg.rbiRating) ? (teamStatsRecentAvg.rbiRating + rbiRating) : rbiRating,
                        homeRunRating: (teamStatsRecentAvg.homeRunRating) ? (teamStatsRecentAvg.homeRunRating + homeRunRating) : homeRunRating,
                        sbRating: (teamStatsRecentAvg.sbRating) ? (teamStatsRecentAvg.sbRating + sbRating) : sbRating,
                        obpRating: (teamStatsRecentAvg.obpRating) ? (teamStatsRecentAvg.obpRating + obpRating) : obpRating,
                        slgRating: (teamStatsRecentAvg.slgRating) ? (teamStatsRecentAvg.slgRating + slgRating) : slgRating,
                        doubleRating: (teamStatsRecentAvg.doubleRating) ? (teamStatsRecentAvg.doubleRating + doubleRating) : doubleRating,
                        walkRating: (teamStatsRecentAvg.walkRating) ? (teamStatsRecentAvg.walkRating + walkRating) : walkRating,
                        opsRating: (teamStatsRecentAvg.opsRating) ? (teamStatsRecentAvg.opsRating + opsRating) : opsRating,
                        winRating: (teamStatsRecentAvg.winRating) ? (teamStatsRecentAvg.winRating + winRating) : winRating,
                        eraRating: (teamStatsRecentAvg.eraRating) ? (teamStatsRecentAvg.eraRating + eraRating) : eraRating,
                        whipRating: (teamStatsRecentAvg.whipRating) ? (teamStatsRecentAvg.whipRating + whipRating) : whipRating,
                        ipRating: (teamStatsRecentAvg.ipRating) ? (teamStatsRecentAvg.ipRating + ipRating) : ipRating,
                        svRating: (teamStatsRecentAvg.svRating) ? (teamStatsRecentAvg.svRating + svRating) : svRating,
                        kRating: (teamStatsRecentAvg.kRating) ? (teamStatsRecentAvg.kRating + kRating) : kRating,
                        holdRating: (teamStatsRecentAvg.holdRating) ? (teamStatsRecentAvg.holdRating + holdRating) : holdRating,
                        saveholdRating: (teamStatsRecentAvg.saveholdRating) ? (teamStatsRecentAvg.saveholdRating + saveholdRating) : saveholdRating,
                        k9Rating: (teamStatsRecentAvg.k9Rating) ? (teamStatsRecentAvg.k9Rating + k9Rating) : k9Rating,
                        qsRating: (teamStatsRecentAvg.qsRating) ? (teamStatsRecentAvg.qsRating + qsRating) : qsRating
                    }
                    break
                }
            }
        }

        //Do the same for the pickup targets to get their data
        for (i = 0; i < playerPickupsSeason.length; i++) {
            for (j = 0; j < playerRankingsSeason.length; j++) {
                var similarTargetsSeason = stringSimilarity.compareTwoStrings(playerPickupsSeason[i].playerName, playerRankingsSeason[j].playerName);
                if (similarTargetsSeason > 0.7) {
                    teamPickupsSeason.push(playerRankingsSeason[j]);
                    break
                }
            }
        }

        for (i = 0; i < playerPickupsRecent.length; i++) {
            for (j = 0; j < playerRankingsRecent.length; j++) {
                var similarTargetsRecent = stringSimilarity.compareTwoStrings(playerPickupsRecent[i].playerName, playerRankingsRecent[j].playerName);
                if (similarTargetsRecent > 0.7) {
                    teamPickupsRecent.push(playerRankingsRecent[j]);
                    break
                }
            }
        }

        this.setState({
            teamStatsSeason: teamStatsSeason,
            teamStatsRecent: teamStatsRecent,
            playerPickupsSeason: teamPickupsSeason,
            playerPickupsRecent: teamPickupsRecent,
            playerPickupsSeasonFiltered: teamPickupsSeason,
            playerPickupsRecentFiltered: teamPickupsRecent
        }, function () {
            localStorage.setItem('teamStatsSeason', JSON.stringify(teamStatsSeason));
            localStorage.setItem('teamStatsRecent', JSON.stringify(teamStatsRecent));
        });

        //Divide averages total by the number of players they have to get avg number
        teamStatsSeasonAvg = {
            overallRating: Number(teamStatsSeasonAvg.overallRating / teamStatsSeason.length).toFixed(2),
            avgRating: Number(teamStatsSeasonAvg.avgRating / batterLength).toFixed(2),
            runRating: Number(teamStatsSeasonAvg.runRating / batterLength).toFixed(2),
            rbiRating: Number(teamStatsSeasonAvg.rbiRating / batterLength).toFixed(2),
            homeRunRating: Number(teamStatsSeasonAvg.homeRunRating / batterLength).toFixed(2),
            sbRating: Number(teamStatsSeasonAvg.sbRating / batterLength).toFixed(2),
            obpRating: Number(teamStatsSeasonAvg.obpRating / batterLength).toFixed(2),
            slgRating: Number(teamStatsSeasonAvg.slgRating / batterLength).toFixed(2),
            doubleRating: Number(teamStatsSeasonAvg.doubleRating / batterLength).toFixed(2),
            walkRating: Number(teamStatsSeasonAvg.walkRating / batterLength).toFixed(2),
            opsRating: Number(teamStatsSeasonAvg.opsRating / batterLength).toFixed(2),
            winRating: Number(teamStatsSeasonAvg.winRating / pitcherLength).toFixed(2),
            eraRating: Number(teamStatsSeasonAvg.eraRating / pitcherLength).toFixed(2),
            whipRating: Number(teamStatsSeasonAvg.whipRating / pitcherLength).toFixed(2),
            ipRating: Number(teamStatsSeasonAvg.ipRating / pitcherLength).toFixed(2),
            svRating: Number(teamStatsSeasonAvg.svRating / pitcherLength).toFixed(2),
            kRating: Number(teamStatsSeasonAvg.kRating / pitcherLength).toFixed(2),
            holdRating: Number(teamStatsSeasonAvg.holdRating / pitcherLength).toFixed(2),
            saveholdRating: Number(teamStatsSeasonAvg.saveholdRating / pitcherLength).toFixed(2),
            k9Rating: Number(teamStatsSeasonAvg.k9Rating / pitcherLength).toFixed(2),
            qsRating: Number(teamStatsSeasonAvg.qsRating / pitcherLength).toFixed(2)
        }

        teamStatsRecentAvg = {
            overallRating: Number(teamStatsRecentAvg.overallRating / teamStatsRecent.length).toFixed(2),
            avgRating: Number(teamStatsRecentAvg.avgRating / batterLength).toFixed(2),
            runRating: Number(teamStatsRecentAvg.runRating / batterLength).toFixed(2),
            rbiRating: Number(teamStatsRecentAvg.rbiRating / batterLength).toFixed(2),
            homeRunRating: Number(teamStatsRecentAvg.homeRunRating / batterLength).toFixed(2),
            sbRating: Number(teamStatsRecentAvg.sbRating / batterLength).toFixed(2),
            obpRating: Number(teamStatsRecentAvg.obpRating / batterLength).toFixed(2),
            slgRating: Number(teamStatsRecentAvg.slgRating / batterLength).toFixed(2),
            doubleRating: Number(teamStatsRecentAvg.doubleRating / batterLength).toFixed(2),
            walkRating: Number(teamStatsRecentAvg.walkRating / batterLength).toFixed(2),
            opsRating: Number(teamStatsRecentAvg.opsRating / batterLength).toFixed(2),
            winRating: Number(teamStatsRecentAvg.winRating / pitcherLength).toFixed(2),
            eraRating: Number(teamStatsRecentAvg.eraRating / pitcherLength).toFixed(2),
            whipRating: Number(teamStatsRecentAvg.whipRating / pitcherLength).toFixed(2),
            ipRating: Number(teamStatsRecentAvg.ipRating / pitcherLength).toFixed(2),
            svRating: Number(teamStatsRecentAvg.svRating / pitcherLength).toFixed(2),
            kRating: Number(teamStatsRecentAvg.kRating / pitcherLength).toFixed(2),
            holdRating: Number(teamStatsRecentAvg.holdRating / pitcherLength).toFixed(2),
            saveholdRating: Number(teamStatsRecentAvg.saveholdRating / pitcherLength).toFixed(2),
            k9Rating: Number(teamStatsRecentAvg.k9Rating / pitcherLength).toFixed(2),
            qsRating: Number(teamStatsRecentAvg.qsRating / pitcherLength).toFixed(2)
        }

        //Put the [] around the arrays so the table below can know its a single row
        this.setState({
            teamStatsSeasonAvg: [teamStatsSeasonAvg],
            teamStatsRecentAvg: [teamStatsRecentAvg]
        }, function () {
            localStorage.setItem('teamStatsSeasonAvg', JSON.stringify(this.state.teamStatsSeasonAvg));
            localStorage.setItem('teamStatsRecentAvg', JSON.stringify(this.state.teamStatsRecentAvg));
        });
    }

    statExist(statName) {
        for (var i = 0; i < this.state.leagueScoring.length; i++) {
            if (statName === this.state.leagueScoring[i]) {
                return true;
            }
        }
    }

    orderRankings() {
        var seasonRankings = [];
        var recentRankings = [];
        var scoringList = [];
        var newSeasonRankings = [];
        var newRecentRankings = [];
        var battingCats = 0;
        var pitchingCats = 0;

        seasonRankings = this.state.playerRankingsSeason;
        recentRankings = this.state.playerRankingsRecent;

        for (var i = 0; i < this.state.leagueScoring.length; i++) {
            switch (this.state.leagueScoring[i]) {
                case 'HR':
                    scoringList.push('homeRun');
                    scoringList.push('homeRunRating');
                    battingCats = battingCats + 1;
                    break;
                case 'G':
                    scoringList.push('games');
                    scoringList.push('gamesRating');
                    battingCats = battingCats + 1;
                    break;
                case 'H':
                    scoringList.push('hit');
                    scoringList.push('hitRating');
                    battingCats = battingCats + 1;
                    break;
                case '2B':
                    scoringList.push('double');
                    scoringList.push('doubleRating');
                    battingCats = battingCats + 1;
                    break;
                case 'BB':
                    scoringList.push('walk');
                    scoringList.push('walkRating');
                    battingCats = battingCats + 1;
                    break;
                case 'R':
                    scoringList.push('run');
                    scoringList.push('runRating');
                    battingCats = battingCats + 1;
                    break;
                case 'RBI':
                    scoringList.push('rbi');
                    scoringList.push('rbiRating');
                    battingCats = battingCats + 1;
                    break;
                case 'SB':
                    scoringList.push('sb');
                    scoringList.push('sbRating');
                    battingCats = battingCats + 1;
                    break;
                case 'AVG':
                    scoringList.push('avg');
                    scoringList.push('avgRating');
                    battingCats = battingCats + 1;
                    break;
                case 'OBP':
                    scoringList.push('obp');
                    scoringList.push('obpRating');
                    battingCats = battingCats + 1;
                    break;
                case 'SLG':
                    scoringList.push('slg');
                    scoringList.push('slgRating');
                    battingCats = battingCats + 1;
                    break;
                case 'OPS':
                    scoringList.push('ops');
                    scoringList.push('opsRating');
                    battingCats = battingCats + 1;
                    break;
                case 'W':
                    scoringList.push('win');
                    scoringList.push('winRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'ERA':
                    scoringList.push('era');
                    scoringList.push('eraRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'WHIP':
                    scoringList.push('whip');
                    scoringList.push('whipRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'IP':
                    scoringList.push('ip');
                    scoringList.push('ipRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'SV':
                    scoringList.push('sv');
                    scoringList.push('svRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'K':
                    scoringList.push('k');
                    scoringList.push('kRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'HD':
                    scoringList.push('hold');
                    scoringList.push('holdRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'SVHD':
                    scoringList.push('savehold');
                    scoringList.push('saveholdRating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'K/9':
                    scoringList.push('k9');
                    scoringList.push('k9Rating');
                    pitchingCats = pitchingCats + 1;
                    break;
                case 'QS':
                    scoringList.push('qs');
                    scoringList.push('qsRating');
                    pitchingCats = pitchingCats + 1;
                    break;
            }
        }

        for (i = 0; i < seasonRankings.length; i++) {
            var playerObject = {
                'playerName': seasonRankings[i].playerName,
                'playerType': seasonRankings[i].playerType,
                'inj': seasonRankings[i].inj,
                'pos': seasonRankings[i].pos
            };
            var playerValue = 0;

            for (var j = 0; j < scoringList.length; j++) {
                playerObject[scoringList[j]] = seasonRankings[i][scoringList[j]]

                if (scoringList[j].includes('Rating')) {
                    playerValue = playerValue + seasonRankings[i][scoringList[j]]
                }
            }

            if (seasonRankings[i].playerType === "Batter") {
                playerObject['overallRating'] = Number(Number(playerValue / battingCats).toFixed(2))
            } else {
                playerObject['overallRating'] = Number(Number(playerValue / pitchingCats).toFixed(2))
            }

            newSeasonRankings.push(playerObject)
        }

        for (i = 0; i < recentRankings.length; i++) {
            var playerObject = {
                'playerName': recentRankings[i].playerName,
                'playerType': recentRankings[i].playerType,
                'inj': recentRankings[i].inj,
                'pos': recentRankings[i].pos
            };
            var playerValue = 0;

            for (var j = 0; j < scoringList.length; j++) {
                playerObject[scoringList[j]] = recentRankings[i][scoringList[j]]

                if (scoringList[j].includes('Rating')) {
                    playerValue = playerValue + recentRankings[i][scoringList[j]]
                }
            }

            if (recentRankings[i].playerType === "Batter") {
                playerObject['overallRating'] = Number(Number(playerValue / battingCats).toFixed(2))
            } else {
                playerObject['overallRating'] = Number(Number(playerValue / pitchingCats).toFixed(2))
            }

            newRecentRankings.push(playerObject)
        }

        newSeasonRankings = newSeasonRankings.sort(function (a, b) {
            return b.overallRating - a.overallRating;
        })

        for (i = 0; i < newSeasonRankings.length; i++) {
            newSeasonRankings[i].overallRank = i + 1;
        }

        newRecentRankings = newRecentRankings.sort(function (a, b) {
            return b.overallRating - a.overallRating;
        })

        for (i = 0; i < newRecentRankings.length; i++) {
            newRecentRankings[i].overallRank = i + 1;
        }

        this.setState({
            playerRankingsSeason: newSeasonRankings,
            playerRankingsRecent: newRecentRankings
        }, function () {
            this.buildTeam()
        })
    }

    filterByPos = (posSelected) => {
        var filterPosArraySeason = [];
        var filterPosArrayRecent = []

        if (posSelected.value === "All") {
            var filterPosArraySeason = this.state.playerPickupsSeason;
            var filterPosArrayRecent = this.state.playerPickupsRecent;
        } else {
            var allPosArraySeason = this.state.playerPickupsSeason;
            var allPosArrayRecent = this.state.playerPickupsRecent;
            for (var i = 0; i < allPosArraySeason.length; i++) {
                if (allPosArraySeason[i].pos === posSelected.value) {
                    filterPosArraySeason.push(allPosArraySeason[i])
                }
            }
            for (i = 0; i < allPosArrayRecent.length; i++) {
                if (allPosArrayRecent[i].pos === posSelected.value) {
                    filterPosArrayRecent.push(allPosArrayRecent[i])
                }
            }
        }
        this.setState({
            posSelected, posSelected,
            playerPickupsSeasonFiltered: filterPosArraySeason,
            playerPickupsRecentFiltered: filterPosArrayRecent
        })
    }

    render() {
        const brightGreen = '#3ffc3f';
        const mediumGreen = '#85fc85';
        const lightGreen = '#b9ffb9';
        const lightRed = '#ffdfdf';
        const mediumRed = '#ffb8b8';
        const brightRed = '#ff8282';

        //Make headers variable in case I need it in the future
        var nameHeader = 'playerName';
        var rankHeader = 'overallRank';
        var ratingHeader = 'overallRating';
        var avgHeader = 'avgRating';
        var runHeader = 'runRating';
        var rbiHeader = 'rbiRating';
        var hrHeader = 'homeRunRating';
        var sbHeader = 'sbRating';
        var obpHeader = 'obpRating';
        var slgHeader = 'slgRating';
        var doubleHeader = 'doubleRating';
        var walkHeader = 'walkRating';
        var opsHeader = 'opsRating';

        var winHeader = 'winRating';
        var eraHeader = 'eraRating';
        var whipHeader = 'whipRating';
        var ipHeader = 'ipRating';
        var svHeader = 'svRating';
        var kHeader = 'kRating';
        var holdHeader = 'holdRating';
        var saveholdHeader = 'saveholdRating';
        var k9Header = 'k9Rating';
        var qsHeader = 'qsRating';

        //column names for the main player columns
        const columnNames = [{
            Header: 'Rank',
            accessor: rankHeader,
            minWidth: 50,
            className: "center"
        }, {
            Header: 'Value',
            accessor: ratingHeader,
            minWidth: 50,
            className: "center"
        }, {
            Header: 'Name',
            accessor: nameHeader,
            width: 150,
            className: "center"
        }, {
            Header: 'Inj',
            accessor: 'inj',
            width: 75,
            className: "center"
        }, {
            Header: 'Pos',
            accessor: 'pos',
            width: 50,
            className: "center"
        }, {
            Header: 'Avg',
            accessor: avgHeader,
            minWidth: 50,
            className: "center",
            show: (this.statExist('AVG')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[avgHeader] > 2 ? brightGreen :
                            rowInfo.row[avgHeader] > 1 ? mediumGreen :
                                rowInfo.row[avgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[avgHeader] < 0 && rowInfo.row[avgHeader] > -1 ? lightRed :
                                        rowInfo.row[avgHeader] <= -1 && rowInfo.row[avgHeader] > -2 ? mediumRed :
                                            rowInfo.row[avgHeader] <= -2 ? brightRed : null,
                    }
                };
            },

        }, {
            Header: 'R',
            accessor: runHeader,
            minWidth: 50,
            className: "center",
            show: (this.statExist('R')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[runHeader] > 2 ? brightGreen :
                            rowInfo.row[runHeader] > 1 ? mediumGreen :
                                rowInfo.row[runHeader] >= .5 ? lightGreen :
                                    rowInfo.row[runHeader] < 0 && rowInfo.row[runHeader] > -1 ? lightRed :
                                        rowInfo.row[runHeader] <= -1 && rowInfo.row[runHeader] > -2 ? mediumRed :
                                            rowInfo.row[runHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'RBI',
            accessor: rbiHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('RBI')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rbiHeader] > 2 ? brightGreen :
                            rowInfo.row[rbiHeader] > 1 ? mediumGreen :
                                rowInfo.row[rbiHeader] >= .5 ? lightGreen :
                                    rowInfo.row[rbiHeader] < 0 && rowInfo.row[rbiHeader] > -1 ? lightRed :
                                        rowInfo.row[rbiHeader] <= -1 && rowInfo.row[rbiHeader] > -2 ? mediumRed :
                                            rowInfo.row[rbiHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'HR',
            accessor: hrHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('HR')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[hrHeader] > 2 ? brightGreen :
                            rowInfo.row[hrHeader] > 1 ? mediumGreen :
                                rowInfo.row[hrHeader] >= .5 ? lightGreen :
                                    rowInfo.row[hrHeader] < 0 && rowInfo.row[hrHeader] > -1 ? lightRed :
                                        rowInfo.row[hrHeader] <= -1 && rowInfo.row[hrHeader] > -2 ? mediumRed :
                                            rowInfo.row[hrHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SB',
            accessor: sbHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SB')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[sbHeader] > 2 ? brightGreen :
                            rowInfo.row[sbHeader] > 1 ? mediumGreen :
                                rowInfo.row[sbHeader] >= .5 ? lightGreen :
                                    rowInfo.row[sbHeader] < 0 && rowInfo.row[sbHeader] > -1 ? lightRed :
                                        rowInfo.row[sbHeader] <= -1 && rowInfo.row[sbHeader] > -2 ? mediumRed :
                                            rowInfo.row[sbHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'OBP',
            accessor: obpHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('OBP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[obpHeader] > 2 ? brightGreen :
                            rowInfo.row[obpHeader] > 1 ? mediumGreen :
                                rowInfo.row[obpHeader] >= .5 ? lightGreen :
                                    rowInfo.row[obpHeader] < 0 && rowInfo.row[obpHeader] > -1 ? lightRed :
                                        rowInfo.row[obpHeader] <= -1 && rowInfo.row[obpHeader] > -2 ? mediumRed :
                                            rowInfo.row[obpHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SLG',
            accessor: slgHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SLG')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[slgHeader] > 2 ? brightGreen :
                            rowInfo.row[slgHeader] > 1 ? mediumGreen :
                                rowInfo.row[slgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[slgHeader] < 0 && rowInfo.row[slgHeader] > -1 ? lightRed :
                                        rowInfo.row[slgHeader] <= -1 && rowInfo.row[slgHeader] > -2 ? mediumRed :
                                            rowInfo.row[slgHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: '2B',
            accessor: doubleHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('2B')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[doubleHeader] > 2 ? brightGreen :
                            rowInfo.row[doubleHeader] > 1 ? mediumGreen :
                                rowInfo.row[doubleHeader] >= .5 ? lightGreen :
                                    rowInfo.row[doubleHeader] < 0 && rowInfo.row[doubleHeader] > -1 ? lightRed :
                                        rowInfo.row[doubleHeader] <= -1 && rowInfo.row[doubleHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'BB',
            accessor: walkHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('BB')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[walkHeader] > 2 ? brightGreen :
                            rowInfo.row[walkHeader] > 1 ? mediumGreen :
                                rowInfo.row[walkHeader] >= .5 ? lightGreen :
                                    rowInfo.row[walkHeader] < 0 && rowInfo.row[walkHeader] > -1 ? lightRed :
                                        rowInfo.row[walkHeader] <= -1 && rowInfo.row[walkHeader] > -2 ? mediumRed :
                                            rowInfo.row[walkHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'OPS',
            accessor: opsHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('OPS')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[opsHeader] > 2 ? brightGreen :
                            rowInfo.row[opsHeader] > 1 ? mediumGreen :
                                rowInfo.row[opsHeader] >= .5 ? lightGreen :
                                    rowInfo.row[opsHeader] < 0 && rowInfo.row[opsHeader] > -1 ? lightRed :
                                        rowInfo.row[opsHeader] <= -1 && rowInfo.row[opsHeader] > -2 ? mediumRed :
                                            rowInfo.row[opsHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'W',
            accessor: winHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('W')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[winHeader] > 2 ? brightGreen :
                            rowInfo.row[winHeader] > 1 ? mediumGreen :
                                rowInfo.row[winHeader] >= .5 ? lightGreen :
                                    rowInfo.row[winHeader] < 0 && rowInfo.row[winHeader] > -1 ? lightRed :
                                        rowInfo.row[winHeader] <= -1 && rowInfo.row[winHeader] > -2 ? mediumRed :
                                            rowInfo.row[winHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'ERA',
            accessor: eraHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('ERA')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[eraHeader] > 2 ? brightGreen :
                            rowInfo.row[eraHeader] > 1 ? mediumGreen :
                                rowInfo.row[eraHeader] >= .5 ? lightGreen :
                                    rowInfo.row[eraHeader] < 0 && rowInfo.row[eraHeader] > -1 ? lightRed :
                                        rowInfo.row[eraHeader] <= -1 && rowInfo.row[eraHeader] > -2 ? mediumRed :
                                            rowInfo.row[eraHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'WHIP',
            accessor: whipHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('WHIP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[whipHeader] > 2 ? brightGreen :
                            rowInfo.row[whipHeader] > 1 ? mediumGreen :
                                rowInfo.row[whipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[whipHeader] < 0 && rowInfo.row[whipHeader] > -1 ? lightRed :
                                        rowInfo.row[whipHeader] <= -1 && rowInfo.row[whipHeader] > -2 ? mediumRed :
                                            rowInfo.row[whipHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'IP',
            accessor: ipHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('IP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ipHeader] > 2 ? brightGreen :
                            rowInfo.row[ipHeader] > 1 ? mediumGreen :
                                rowInfo.row[ipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ipHeader] < 0 && rowInfo.row[ipHeader] > -1 ? lightRed :
                                        rowInfo.row[ipHeader] <= -1 && rowInfo.row[ipHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'QS',
            accessor: qsHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('QS')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ipHeader] > 2 ? brightGreen :
                            rowInfo.row[ipHeader] > 1 ? mediumGreen :
                                rowInfo.row[ipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ipHeader] < 0 && rowInfo.row[ipHeader] > -1 ? lightRed :
                                        rowInfo.row[ipHeader] <= -1 && rowInfo.row[ipHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SV',
            accessor: svHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SV')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[svHeader] > 2 ? brightGreen :
                            rowInfo.row[svHeader] > 1 ? mediumGreen :
                                rowInfo.row[svHeader] >= .5 ? lightGreen :
                                    rowInfo.row[svHeader] < 0 && rowInfo.row[svHeader] > -1 ? lightRed :
                                        rowInfo.row[svHeader] <= -1 && rowInfo.row[svHeader] > -2 ? mediumRed :
                                            rowInfo.row[svHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'K',
            accessor: kHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('K')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[kHeader] > 2 ? brightGreen :
                            rowInfo.row[kHeader] > 1 ? mediumGreen :
                                rowInfo.row[kHeader] >= .5 ? lightGreen :
                                    rowInfo.row[kHeader] < 0 && rowInfo.row[kHeader] > -1 ? lightRed :
                                        rowInfo.row[kHeader] <= -1 && rowInfo.row[kHeader] > -2 ? mediumRed :
                                            rowInfo.row[kHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'HD',
            accessor: holdHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('HD')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[holdHeader] > 2 ? brightGreen :
                            rowInfo.row[holdHeader] > 1 ? mediumGreen :
                                rowInfo.row[holdHeader] >= .5 ? lightGreen :
                                    rowInfo.row[holdHeader] < 0 && rowInfo.row[holdHeader] > -1 ? lightRed :
                                        rowInfo.row[holdHeader] <= -1 && rowInfo.row[holdHeader] > -2 ? mediumRed :
                                            rowInfo.row[holdHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SVHD',
            accessor: saveholdHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SVHD')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[saveholdHeader] > 2 ? brightGreen :
                            rowInfo.row[saveholdHeader] > 1 ? mediumGreen :
                                rowInfo.row[saveholdHeader] >= .5 ? lightGreen :
                                    rowInfo.row[saveholdHeader] < 0 && rowInfo.row[saveholdHeader] > -1 ? lightRed :
                                        rowInfo.row[saveholdHeader] <= -1 && rowInfo.row[saveholdHeader] > -2 ? mediumRed :
                                            rowInfo.row[saveholdHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'K/9',
            accessor: k9Header,
            className: "center",
            minWidth: 50,
            show: (this.statExist('K/9')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[k9Header] > 2 ? brightGreen :
                            rowInfo.row[k9Header] > 1 ? mediumGreen :
                                rowInfo.row[k9Header] >= .5 ? lightGreen :
                                    rowInfo.row[k9Header] < 0 && rowInfo.row[k9Header] > -1 ? lightRed :
                                        rowInfo.row[k9Header] <= -1 && rowInfo.row[k9Header] > -2 ? mediumRed :
                                            rowInfo.row[k9Header] <= -2 ? brightRed : null,
                    },
                };
            }
        }];

        //column names for the average tables
        const columnNamesAvg = [{
            Header: 'Avg',
            accessor: avgHeader,
            minWidth: 50,
            className: "center",
            show: (this.statExist('AVG')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[avgHeader] > 2 ? brightGreen :
                            rowInfo.row[avgHeader] > 1 ? mediumGreen :
                                rowInfo.row[avgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[avgHeader] < 0 && rowInfo.row[avgHeader] > -1 ? lightRed :
                                        rowInfo.row[avgHeader] <= -1 && rowInfo.row[avgHeader] > -2 ? mediumRed :
                                            rowInfo.row[avgHeader] <= -2 ? brightRed : null,
                    }
                };
            },

        }, {
            Header: 'R',
            accessor: runHeader,
            minWidth: 50,
            className: "center",
            show: (this.statExist('R')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[runHeader] > 2 ? brightGreen :
                            rowInfo.row[runHeader] > 1 ? mediumGreen :
                                rowInfo.row[runHeader] >= .5 ? lightGreen :
                                    rowInfo.row[runHeader] < 0 && rowInfo.row[runHeader] > -1 ? lightRed :
                                        rowInfo.row[runHeader] <= -1 && rowInfo.row[runHeader] > -2 ? mediumRed :
                                            rowInfo.row[runHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'RBI',
            accessor: rbiHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('RBI')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rbiHeader] > 2 ? brightGreen :
                            rowInfo.row[rbiHeader] > 1 ? mediumGreen :
                                rowInfo.row[rbiHeader] >= .5 ? lightGreen :
                                    rowInfo.row[rbiHeader] < 0 && rowInfo.row[rbiHeader] > -1 ? lightRed :
                                        rowInfo.row[rbiHeader] <= -1 && rowInfo.row[rbiHeader] > -2 ? mediumRed :
                                            rowInfo.row[rbiHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'HR',
            accessor: hrHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('HR')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[hrHeader] > 2 ? brightGreen :
                            rowInfo.row[hrHeader] > 1 ? mediumGreen :
                                rowInfo.row[hrHeader] >= .5 ? lightGreen :
                                    rowInfo.row[hrHeader] < 0 && rowInfo.row[hrHeader] > -1 ? lightRed :
                                        rowInfo.row[hrHeader] <= -1 && rowInfo.row[hrHeader] > -2 ? mediumRed :
                                            rowInfo.row[hrHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SB',
            accessor: sbHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SB')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[sbHeader] > 2 ? brightGreen :
                            rowInfo.row[sbHeader] > 1 ? mediumGreen :
                                rowInfo.row[sbHeader] >= .5 ? lightGreen :
                                    rowInfo.row[sbHeader] < 0 && rowInfo.row[sbHeader] > -1 ? lightRed :
                                        rowInfo.row[sbHeader] <= -1 && rowInfo.row[sbHeader] > -2 ? mediumRed :
                                            rowInfo.row[sbHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'OBP',
            accessor: obpHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('OBP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[obpHeader] > 2 ? brightGreen :
                            rowInfo.row[obpHeader] > 1 ? mediumGreen :
                                rowInfo.row[obpHeader] >= .5 ? lightGreen :
                                    rowInfo.row[obpHeader] < 0 && rowInfo.row[obpHeader] > -1 ? lightRed :
                                        rowInfo.row[obpHeader] <= -1 && rowInfo.row[obpHeader] > -2 ? mediumRed :
                                            rowInfo.row[obpHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SLG',
            accessor: slgHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SLG')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[slgHeader] > 2 ? brightGreen :
                            rowInfo.row[slgHeader] > 1 ? mediumGreen :
                                rowInfo.row[slgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[slgHeader] < 0 && rowInfo.row[slgHeader] > -1 ? lightRed :
                                        rowInfo.row[slgHeader] <= -1 && rowInfo.row[slgHeader] > -2 ? mediumRed :
                                            rowInfo.row[slgHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: '2B',
            accessor: doubleHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('2B')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[doubleHeader] > 2 ? brightGreen :
                            rowInfo.row[doubleHeader] > 1 ? mediumGreen :
                                rowInfo.row[doubleHeader] >= .5 ? lightGreen :
                                    rowInfo.row[doubleHeader] < 0 && rowInfo.row[doubleHeader] > -1 ? lightRed :
                                        rowInfo.row[doubleHeader] <= -1 && rowInfo.row[doubleHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'BB',
            accessor: walkHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('BB')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[walkHeader] > 2 ? brightGreen :
                            rowInfo.row[walkHeader] > 1 ? mediumGreen :
                                rowInfo.row[walkHeader] >= .5 ? lightGreen :
                                    rowInfo.row[walkHeader] < 0 && rowInfo.row[walkHeader] > -1 ? lightRed :
                                        rowInfo.row[walkHeader] <= -1 && rowInfo.row[walkHeader] > -2 ? mediumRed :
                                            rowInfo.row[walkHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'OPS',
            accessor: opsHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('OPS')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[opsHeader] > 2 ? brightGreen :
                            rowInfo.row[opsHeader] > 1 ? mediumGreen :
                                rowInfo.row[opsHeader] >= .5 ? lightGreen :
                                    rowInfo.row[opsHeader] < 0 && rowInfo.row[opsHeader] > -1 ? lightRed :
                                        rowInfo.row[opsHeader] <= -1 && rowInfo.row[opsHeader] > -2 ? mediumRed :
                                            rowInfo.row[opsHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'W',
            accessor: winHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('W')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[winHeader] > 2 ? brightGreen :
                            rowInfo.row[winHeader] > 1 ? mediumGreen :
                                rowInfo.row[winHeader] >= .5 ? lightGreen :
                                    rowInfo.row[winHeader] < 0 && rowInfo.row[winHeader] > -1 ? lightRed :
                                        rowInfo.row[winHeader] <= -1 && rowInfo.row[winHeader] > -2 ? mediumRed :
                                            rowInfo.row[winHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'ERA',
            accessor: eraHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('ERA')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[eraHeader] > 2 ? brightGreen :
                            rowInfo.row[eraHeader] > 1 ? mediumGreen :
                                rowInfo.row[eraHeader] >= .5 ? lightGreen :
                                    rowInfo.row[eraHeader] < 0 && rowInfo.row[eraHeader] > -1 ? lightRed :
                                        rowInfo.row[eraHeader] <= -1 && rowInfo.row[eraHeader] > -2 ? mediumRed :
                                            rowInfo.row[eraHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'WHIP',
            accessor: whipHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('WHIP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[whipHeader] > 2 ? brightGreen :
                            rowInfo.row[whipHeader] > 1 ? mediumGreen :
                                rowInfo.row[whipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[whipHeader] < 0 && rowInfo.row[whipHeader] > -1 ? lightRed :
                                        rowInfo.row[whipHeader] <= -1 && rowInfo.row[whipHeader] > -2 ? mediumRed :
                                            rowInfo.row[whipHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'IP',
            accessor: ipHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('IP')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ipHeader] > 2 ? brightGreen :
                            rowInfo.row[ipHeader] > 1 ? mediumGreen :
                                rowInfo.row[ipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ipHeader] < 0 && rowInfo.row[ipHeader] > -1 ? lightRed :
                                        rowInfo.row[ipHeader] <= -1 && rowInfo.row[ipHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'QS',
            accessor: qsHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('QS')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ipHeader] > 2 ? brightGreen :
                            rowInfo.row[ipHeader] > 1 ? mediumGreen :
                                rowInfo.row[ipHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ipHeader] < 0 && rowInfo.row[ipHeader] > -1 ? lightRed :
                                        rowInfo.row[ipHeader] <= -1 && rowInfo.row[ipHeader] > -2 ? mediumRed :
                                            rowInfo.row[doubleHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SV',
            accessor: svHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SV')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[svHeader] > 2 ? brightGreen :
                            rowInfo.row[svHeader] > 1 ? mediumGreen :
                                rowInfo.row[svHeader] >= .5 ? lightGreen :
                                    rowInfo.row[svHeader] < 0 && rowInfo.row[svHeader] > -1 ? lightRed :
                                        rowInfo.row[svHeader] <= -1 && rowInfo.row[svHeader] > -2 ? mediumRed :
                                            rowInfo.row[svHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'K',
            accessor: kHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('K')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[kHeader] > 2 ? brightGreen :
                            rowInfo.row[kHeader] > 1 ? mediumGreen :
                                rowInfo.row[kHeader] >= .5 ? lightGreen :
                                    rowInfo.row[kHeader] < 0 && rowInfo.row[kHeader] > -1 ? lightRed :
                                        rowInfo.row[kHeader] <= -1 && rowInfo.row[kHeader] > -2 ? mediumRed :
                                            rowInfo.row[kHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'HD',
            accessor: holdHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('HD')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[holdHeader] > 2 ? brightGreen :
                            rowInfo.row[holdHeader] > 1 ? mediumGreen :
                                rowInfo.row[holdHeader] >= .5 ? lightGreen :
                                    rowInfo.row[holdHeader] < 0 && rowInfo.row[holdHeader] > -1 ? lightRed :
                                        rowInfo.row[holdHeader] <= -1 && rowInfo.row[holdHeader] > -2 ? mediumRed :
                                            rowInfo.row[holdHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'SVHD',
            accessor: saveholdHeader,
            className: "center",
            minWidth: 50,
            show: (this.statExist('SVHD')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[saveholdHeader] > 2 ? brightGreen :
                            rowInfo.row[saveholdHeader] > 1 ? mediumGreen :
                                rowInfo.row[saveholdHeader] >= .5 ? lightGreen :
                                    rowInfo.row[saveholdHeader] < 0 && rowInfo.row[saveholdHeader] > -1 ? lightRed :
                                        rowInfo.row[saveholdHeader] <= -1 && rowInfo.row[saveholdHeader] > -2 ? mediumRed :
                                            rowInfo.row[saveholdHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'K/9',
            accessor: k9Header,
            className: "center",
            minWidth: 50,
            show: (this.statExist('K/9')) ? true : false,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[k9Header] > 2 ? brightGreen :
                            rowInfo.row[k9Header] > 1 ? mediumGreen :
                                rowInfo.row[k9Header] >= .5 ? lightGreen :
                                    rowInfo.row[k9Header] < 0 && rowInfo.row[k9Header] > -1 ? lightRed :
                                        rowInfo.row[k9Header] <= -1 && rowInfo.row[k9Header] > -2 ? mediumRed :
                                            rowInfo.row[k9Header] <= -2 ? brightRed : null,
                    },
                };
            }
        }];

        const expandedColumnNames = [{
            headerClassName: 'hide',
            width: 35,
            className: "center"
        }, {
            headerClassName: 'hide',
            minWidth: 50,
            className: "center"
        }, {
            headerClassName: 'hide',
            minWidth: 50,
            className: "center"
        }, {
            headerClassName: 'hide',
            width: 150,
            className: "center",
            Cell: row => (
                <div>Stats per game</div>
            )
        }, {
            headerClassName: 'hide',
            minWidth: 50,
            accessor: 'avg',
            show: (this.statExist('AVG')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'run',
            minWidth: 50,
            show: (this.statExist('R')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'rbi',
            minWidth: 50,
            show: (this.statExist('RBI')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'homeRun',
            minWidth: 50,
            show: (this.statExist('HR')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'sb',
            minWidth: 50,
            show: (this.statExist('SB')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'obp',
            minWidth: 50,
            show: (this.statExist('OBP')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'slg',
            minWidth: 50,
            show: (this.statExist('SLG')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'double',
            minWidth: 50,
            show: (this.statExist('2B')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'walk',
            minWidth: 50,
            show: (this.statExist('BB')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ops',
            minWidth: 50,
            show: (this.statExist('OPS')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'win',
            minWidth: 50,
            show: (this.statExist('W')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'era',
            minWidth: 50,
            show: (this.statExist('ERA')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'whip',
            minWidth: 50,
            show: (this.statExist('WHIP')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ip',
            minWidth: 50,
            show: (this.statExist('IP')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'qs',
            minWidth: 50,
            show: (this.statExist('QS')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'sv',
            minWidth: 50,
            show: (this.statExist('SV')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'k',
            minWidth: 50,
            show: (this.statExist('K')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'hold',
            minWidth: 50,
            show: (this.statExist('HD')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'savehold',
            minWidth: 50,
            show: (this.statExist('SVHD')) ? true : false,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'k9',
            minWidth: 50,
            show: (this.statExist('K/9')) ? true : false,
            className: "center"
        }]

        //Send to the compare teams component once we have the leagueId
        var compareTeamsHTML = "";

        if (this.state.leagueId && this.state.playerRankingsSeason) {
            compareTeamsHTML = <CompareTeams leagueId={this.state.leagueId} teams={this.state.teams} columnNames={columnNames}
                playerRankingsSeason={this.state.playerRankingsSeason} playerRankingsRecent={this.state.playerRankingsRecent}
                columnNamesAvg={columnNamesAvg} updateCompareTable={this.state.updateCompareTable} expandedColumnNames={expandedColumnNames}
                title="Compare to league teams" showRecentRankings={this.state.showRecentRankings} />

        }

        //Update the switch stats button text on state change
        var showStatsText;

        if (!this.state.showBBMStats) {
            showStatsText = 'Use BaseballMonster Rankings';
        } else {
            showStatsText = 'Use FantasyBaseball.io Rankings';
        }

        var showRankingsText;
        if (!this.state.showRecentRankings) {
            showRankingsText = 'Show Recent Data';
        } else {
            showRankingsText = 'Show Season Data';
        }

        var loading;
        if (this.state.teamStatsSeasonAvg.length > 0) {
            loading = <span></span>
        } else {
            if (this.state.drafted === true) {
                loading =
                    <div className="site-loading flex">
                        <div className="site-loading-text">Loading in your data...</div>
                    </div>;
            } else {
                loading =
                    <div className="site-loading flex">
                        <div className="site-loading-text"><a href="/logout">League has not drafted. Please Logout</a>.</div>
                    </div>;
            }

        }

        var positionOptions = [
            { value: 'All', label: 'All' },
            { value: 'C', label: 'C' },
            { value: '1B', label: '1B' },
            { value: '2B', label: '2B' },
            { value: 'SS', label: 'SS' },
            { value: '3B', label: '3B' },
            { value: 'OF', label: 'OF' },
            { value: 'SP', label: 'SP' },
            { value: 'RP', label: 'RP' }
        ];

        const { posSelected } = this.state;

        return (
            <div className="table-container flex-vertical">
                {loading}
                <div className="table-info-container flex-vertical">
                    <div className="table-info-headers flex">
                        <div className="table-info-header" onClick={this.changeRankings}>{showRankingsText}</div>
                        {/* <div className="table-info-header" onClick={this.changeStats}>{showStatsText}</div> */}
                    </div>
                    <div className="table-info-tables">
                        <div className="table-group">
                            <div className={`team-table-container ${this.state.showRecentRankings ? 'hide' : ''}`}>
                                <h2 className="team-table-header">Team Rankings</h2>
                                <div className="team-avg-table">
                                    <ReactTable
                                        data={this.state.teamStatsSeasonAvg}
                                        columns={columnNamesAvg}
                                        showPagination={false}
                                        minRows={0}
                                    />
                                </div>
                                <div className="team-table">
                                    <ReactTable
                                        data={this.state.teamStatsSeason}
                                        columns={columnNames}
                                        showPagination={false}
                                        minRows={0}
                                        defaultSortDesc={true}
                                        defaultPageSize={100}
                                        defaultSorted={[{
                                            id: 'overallRank',
                                            desc: false
                                        }]}
                                        SubComponent={row => {
                                            return (
                                                <ReactTable
                                                    data={[row.original]}
                                                    columns={expandedColumnNames}
                                                    showPagination={false}
                                                    defaultPageSize={1}
                                                    className="expandedRow"
                                                />
                                            );
                                        }}

                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`team-table-container ${this.state.showRecentRankings ? '' : 'hide'}`}>
                            <h2 className="team-table-header">Team Rankings</h2>
                            <div className="team-avg-table">
                                <ReactTable
                                    data={this.state.teamStatsRecentAvg}
                                    columns={columnNamesAvg}
                                    showPagination={false}
                                    minRows={0}
                                />
                            </div>
                            <div className="team-table">
                                <ReactTable
                                    data={this.state.teamStatsRecent}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
                                    defaultPageSize={100}
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}
                                    SubComponent={row => {
                                        return (
                                            <ReactTable
                                                data={[row.original]}
                                                columns={expandedColumnNames}
                                                showPagination={false}
                                                defaultPageSize={1}
                                                className="expandedRow"
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {compareTeamsHTML}

                        <div className={`team-table-container ${this.state.showRecentRankings ? 'hide' : ''}`}>
                            <h2 className="team-table-header">Potential Pickup Targets</h2>
                            <div className="flex">
                                <div className="position-select">
                                    <Select
                                        value={posSelected}
                                        onChange={this.filterByPos}
                                        options={positionOptions}
                                        className='react-select-container-pos'
                                        classNamePrefix='react-select-pos'
                                        placeholder='Filter By Position...'
                                    />
                                </div>
                            </div>

                            <div className="team-table">
                                <ReactTable
                                    data={this.state.playerPickupsSeasonFiltered}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}
                                    defaultPageSize={25}
                                    SubComponent={row => {
                                        return (
                                            <ReactTable
                                                data={[row.original]}
                                                columns={expandedColumnNames}
                                                showPagination={false}
                                                defaultPageSize={1}
                                                className="expandedRow"
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className={`team-table-container ${this.state.showRecentRankings ? '' : 'hide'}`}>
                            <h3 className="team-table-header">Potential Pickup Targets</h3>
                            <div className="flex">
                                <div className="position-select">
                                    <Select
                                        value={posSelected}
                                        onChange={this.filterByPos}
                                        options={positionOptions}
                                        className='react-select-container-pos'
                                        classNamePrefix='react-select-pos'
                                        placeholder='Filter By Position...'
                                    />
                                </div>
                            </div>
                            <div className="team-table">
                                <ReactTable
                                    data={this.state.playerPickupsRecentFiltered}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}
                                    defaultPageSize={25}
                                    SubComponent={row => {
                                        return (
                                            <ReactTable
                                                data={[row.original]}
                                                columns={expandedColumnNames}
                                                showPagination={false}
                                                defaultPageSize={1}
                                                className="expandedRow"
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}