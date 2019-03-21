import React, { Component } from 'react';
import Cookies from 'js-cookie';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import stringSimilarity from 'string-similarity';
import { CompareTeams } from './CompareTeams';
import { callApi } from './CallApi';
import ReactGA from 'react-ga';
// ReactGA.initialize('UA-135378238-1');
// ReactGA.pageview("/?logged-in=true");

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
            updateCompareTable: false
        }
        this.changeStats = this.changeStats.bind(this);
        this.changeRankings = this.changeRankings.bind(this);
    }

    componentDidMount() {
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
        if (!(JSON.parse(localStorage.getItem('playerTargetsBBMRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerTargetsBBMSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsBBMRecent')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('playerRankingsBBMSeason')))) allData = false;
        if (!(JSON.parse(localStorage.getItem('teamPlayers')))) allData = false;


        if (leagueId) {
            this.setState({ leagueId: leagueId });

            //If it is greater or equal to the day after the last time they got data, expire doesn't exist, or dont have all data, update all
            if ((today >= expireDate) || (expireDate === undefined) || allData === false) {
                //Get all the league info from each api endpoint
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
                callApi('/api/player_data/season/')
                    .then(results => {
                        var playerData = results;
                        this.setState({
                            playerRankingsLocalSeason: playerData,
                            playerRankingsSeason: playerData
                        });
                        localStorage.setItem('playerRankingsLocalSeason', JSON.stringify(playerData));
                        localStorage.setItem('playerRankingsSeason', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //Local rankings for recent
                callApi('/api/player_data/recent/')
                    .then(results => {
                        var playerData = results;
                        this.setState({
                            playerRankingsLocalRecent: playerData,
                            playerRankingsRecent: playerData
                        });
                        localStorage.setItem('playerRankingsLocalRecent', JSON.stringify(playerData));
                        localStorage.setItem('playerRankingsRecent', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //List of the teams in the league
                callApi('/api/teams/' + leagueId)
                    .then(results => {
                        var teams = results[0].teams;
                        this.setState({ teams: teams });
                        localStorage.setItem('teams', JSON.stringify(teams));
                    })
                    .catch(err => console.log(err));

                //BBM targets recent
                callApi('/api/targets/bbm/recent/' + leagueId)
                    .then(results => {
                        var playerData = results[0].players;
                        this.setState({ playerTargetsBBMRecent: playerData });
                        localStorage.setItem('playerTargetsBBMRecent', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //BBM targets season
                callApi('/api/targets/bbm/season/' + leagueId)
                    .then(results => {
                        var playerData = results[0].players;
                        this.setState({ playerTargetsBBMSeason: playerData });
                        localStorage.setItem('playerTargetsBBMSeason', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //BBM rankings season
                callApi('/api/rankings/bbm/season/')
                    .then(results => {
                        var playerData = results;
                        this.setState({ playerRankingsBBMSeason: playerData });
                        localStorage.setItem('playerRankingsBBMSeason', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                //BBM rankings recent
                callApi('/api/rankings/bbm/recent/')
                    .then(results => {
                        var playerData = results;
                        this.setState({ playerRankingsBBMRecent: playerData });
                        localStorage.setItem('playerRankingsBBMRecent', JSON.stringify(playerData));
                    })
                    .catch(err => console.log(err));

                if (teamId) {
                    //Their team data
                    callApi('/api/teams/' + leagueId + '/' + teamId)
                        .then(results => {
                            var playerData = results;
                            //check if the data is there, and if not, add a 1 sec wait then send to the build function
                            if (this.state.playerRankingsSeason.length === 0 || this.state.playerRankingsRecent.length === 0) {
                                setTimeout(function () {
                                    localStorage.setItem('teamPlayers', JSON.stringify(playerData));
                                    this.setState({ teamPlayers: playerData }, this.buildTeam);
                                }.bind(this), 1000)
                            } else {
                                localStorage.setItem('teamPlayers', JSON.stringify(playerData));
                                this.setState({ teamPlayers: playerData }, this.buildTeam);
                            }
                        })
                        .catch(err => console.log(err));
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
                }, this.buildTeam);
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

        //for each player on the team, if string similarity > .7 in the player rankings, then add that player to the array
        for (var i = 0; i < teamPlayers.length; i++) {
            for (var j = 0; j < playerRankingsSeason.length; j++) {
                var similarPlayerSeason = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsSeason[j].playerName);
                if (similarPlayerSeason > 0.7) {
                    //Push the player to the team array
                    teamStatsSeason.push(playerRankingsSeason[j]);
                    //Start calculating averages by adding them all up
                    var avgRating = (playerRankingsSeason[j].avgRating) ? (playerRankingsSeason[j].avgRating) : 0;
                    teamStatsSeasonAvg = {
                        overallRating: (teamStatsSeasonAvg.overallRating) ? (teamStatsSeasonAvg.overallRating + playerRankingsSeason[j].overallRating) : playerRankingsSeason[j].overallRating,
                        avgRating: (teamStatsSeasonAvg.avgRating) ? (teamStatsSeasonAvg.avgRating + avgRating) : avgRating,
                        runRating: (teamStatsSeasonAvg.runRating) ? (teamStatsSeasonAvg.runRating + playerRankingsSeason[j].runRating) : playerRankingsSeason[j].runRating,
                        rbiRating: (teamStatsSeasonAvg.rbiRating) ? (teamStatsSeasonAvg.rbiRating + playerRankingsSeason[j].rbiRating) : playerRankingsSeason[j].rbiRating,
                        homeRunRating: (teamStatsSeasonAvg.homeRunRating) ? (teamStatsSeasonAvg.homeRunRating + playerRankingsSeason[j].homeRunRating) : playerRankingsSeason[j].homeRunRating,
                        sbRating: (teamStatsSeasonAvg.sbRating) ? (teamStatsSeasonAvg.sbRating + playerRankingsSeason[j].sbRating) : playerRankingsSeason[j].sbRating,
                        obpRating: (teamStatsSeasonAvg.obpRating) ? (teamStatsSeasonAvg.obpRating + playerRankingsSeason[j].obpRating) : playerRankingsSeason[j].obpRating,
                        slgRating: (teamStatsSeasonAvg.slgRating) ? (teamStatsSeasonAvg.slgRating + playerRankingsSeason[j].slgRating) : playerRankingsSeason[j].slgRating,
                        doubleRating: (teamStatsSeasonAvg.doubleRating) ? (teamStatsSeasonAvg.doubleRating + playerRankingsSeason[j].doubleRating) : playerRankingsSeason[j].doubleRating,
                        walkRating: (teamStatsSeasonAvg.walkRating) ? (teamStatsSeasonAvg.walkRating + playerRankingsSeason[j].walkRating) : playerRankingsSeason[j].walkRating,
                        opsRating: (teamStatsSeasonAvg.opsRating) ? (teamStatsSeasonAvg.opsRating + playerRankingsSeason[j].opsRating) : playerRankingsSeason[j].opsRating,
                        winRating: (teamStatsSeasonAvg.winRating) ? (teamStatsSeasonAvg.winRating + playerRankingsSeason[j].winRating) : playerRankingsSeason[j].winRating,
                        eraRating: (teamStatsSeasonAvg.eraRating) ? (teamStatsSeasonAvg.eraRating + playerRankingsSeason[j].eraRating) : playerRankingsSeason[j].eraRating,
                        whipRating: (teamStatsSeasonAvg.whipRating) ? (teamStatsSeasonAvg.whipRating + playerRankingsSeason[j].whipRating) : playerRankingsSeason[j].whipRating,
                        ipRating: (teamStatsSeasonAvg.ipRating) ? (teamStatsSeasonAvg.ipRating + playerRankingsSeason[j].ipRating) : playerRankingsSeason[j].ipRating,
                        svRating: (teamStatsSeasonAvg.svRating) ? (teamStatsSeasonAvg.svRating + playerRankingsSeason[j].svRating) : playerRankingsSeason[j].svRating,
                        kRating: (teamStatsSeasonAvg.kRating) ? (teamStatsSeasonAvg.kRating + playerRankingsSeason[j].kRating) : playerRankingsSeason[j].kRating,
                        holdRating: (teamStatsSeasonAvg.holdRating) ? (teamStatsSeasonAvg.holdRating + playerRankingsSeason[j].holdRating) : playerRankingsSeason[j].holdRating,
                        saveholdRating: (teamStatsSeasonAvg.saveholdRating) ? (teamStatsSeasonAvg.saveholdRating + playerRankingsSeason[j].saveholdRating) : playerRankingsSeason[j].saveholdRating,
                        k9Rating: (teamStatsSeasonAvg.k9Rating) ? (teamStatsSeasonAvg.k9Rating + playerRankingsSeason[j].k9Rating) : playerRankingsSeason[j].k9Rating
                    }
                    console.log(teamStatsSeasonAvg.avgRating)
                    break
                }
            }

            //Same here for recent data
            for (j = 0; j < playerRankingsRecent.length; j++) {
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsRecent[j].playerName);
                if (similarPlayerRecent > 0.7) {
                    teamStatsRecent.push(playerRankingsRecent[j]);
                    teamStatsRecentAvg = {
                        overallRating: (teamStatsRecentAvg.overallRating) ? (teamStatsRecentAvg.overallRating + playerRankingsRecent[j].overallRating) : playerRankingsRecent[j].overallRating,
                        avgRating: (teamStatsRecentAvg.avgRating) ? (teamStatsRecentAvg.avgRating + playerRankingsSeason[j].avgRating) : playerRankingsSeason[j].avgRating,
                        runRating: (teamStatsRecentAvg.runRating) ? (teamStatsRecentAvg.runRating + playerRankingsSeason[j].runRating) : playerRankingsSeason[j].runRating,
                        rbiRating: (teamStatsRecentAvg.rbiRating) ? (teamStatsRecentAvg.rbiRating + playerRankingsSeason[j].rbiRating) : playerRankingsSeason[j].rbiRating,
                        homeRunRating: (teamStatsRecentAvg.homeRunRating) ? (teamStatsRecentAvg.homeRunRating + playerRankingsSeason[j].homeRunRating) : playerRankingsSeason[j].homeRunRating,
                        sbRating: (teamStatsRecentAvg.sbRating) ? (teamStatsRecentAvg.sbRating + playerRankingsSeason[j].sbRating) : playerRankingsSeason[j].sbRating,
                        obpRating: (teamStatsRecentAvg.obpRating) ? (teamStatsRecentAvg.obpRating + playerRankingsSeason[j].obpRating) : playerRankingsSeason[j].obpRating,
                        slgRating: (teamStatsRecentAvg.slgRating) ? (teamStatsRecentAvg.slgRating + playerRankingsSeason[j].slgRating) : playerRankingsSeason[j].slgRating,
                        doubleRating: (teamStatsRecentAvg.doubleRating) ? (teamStatsRecentAvg.doubleRating + playerRankingsSeason[j].doubleRating) : playerRankingsSeason[j].doubleRating,
                        walkRating: (teamStatsRecentAvg.walkRating) ? (teamStatsRecentAvg.walkRating + playerRankingsSeason[j].walkRating) : playerRankingsSeason[j].walkRating,
                        opsRating: (teamStatsRecentAvg.opsRating) ? (teamStatsRecentAvg.opsRating + playerRankingsSeason[j].opsRating) : playerRankingsSeason[j].opsRating,
                        winRating: (teamStatsRecentAvg.winRating) ? (teamStatsRecentAvg.winRating + playerRankingsSeason[j].winRating) : playerRankingsSeason[j].winRating,
                        eraRating: (teamStatsRecentAvg.eraRating) ? (teamStatsRecentAvg.eraRating + playerRankingsSeason[j].eraRating) : playerRankingsSeason[j].eraRating,
                        whipRating: (teamStatsRecentAvg.whipRating) ? (teamStatsRecentAvg.whipRating + playerRankingsSeason[j].whipRating) : playerRankingsSeason[j].whipRating,
                        ipRating: (teamStatsRecentAvg.ipRating) ? (teamStatsRecentAvg.ipRating + playerRankingsSeason[j].ipRating) : playerRankingsSeason[j].ipRating,
                        svRating: (teamStatsRecentAvg.svRating) ? (teamStatsRecentAvg.svRating + playerRankingsSeason[j].svRating) : playerRankingsSeason[j].svRating,
                        kRating: (teamStatsRecentAvg.kRating) ? (teamStatsRecentAvg.kRating + playerRankingsSeason[j].kRating) : playerRankingsSeason[j].kRating,
                        holdRating: (teamStatsRecentAvg.holdRating) ? (teamStatsRecentAvg.holdRating + playerRankingsSeason[j].holdRating) : playerRankingsSeason[j].holdRating,
                        saveholdRating: (teamStatsRecentAvg.saveholdRating) ? (teamStatsRecentAvg.saveholdRating + playerRankingsSeason[j].saveholdRating) : playerRankingsSeason[j].saveholdRating,
                        k9Rating: (teamStatsRecentAvg.k9Rating) ? (teamStatsRecentAvg.k9Rating + playerRankingsSeason[j].k9Rating) : playerRankingsSeason[j].k9Rating
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
            playerPickupsSeason: playerPickupsSeason,
            playerPickupsRecent: playerPickupsRecent
        }, function () {
            localStorage.setItem('teamStatsSeason', JSON.stringify(teamStatsSeason));
            localStorage.setItem('teamStatsRecent', JSON.stringify(teamStatsRecent));
        });

        //Divide averages total by the number of players they have to get avg number
        teamStatsSeasonAvg = {
            overallRating: Number(teamStatsSeasonAvg.overallRating / teamStatsSeason.length).toFixed(2),
            avgRating: Number(teamStatsSeasonAvg.avgRating / teamStatsSeason.length).toFixed(2),
            runRating: Number(teamStatsSeasonAvg.runRating / teamStatsSeason.length).toFixed(2),
            rbiRating: Number(teamStatsSeasonAvg.rbiRating / teamStatsSeason.length).toFixed(2),
            homeRunRating: Number(teamStatsSeasonAvg.homeRunRating / teamStatsSeason.length).toFixed(2),
            sbRating: Number(teamStatsSeasonAvg.sbRating / teamStatsSeason.length).toFixed(2),
            obpRating: Number(teamStatsSeasonAvg.obpRating / teamStatsSeason.length).toFixed(2),
            slgRating: Number(teamStatsSeasonAvg.slgRating / teamStatsSeason.length).toFixed(2),
            doubleRating: Number(teamStatsSeasonAvg.doubleRating / teamStatsSeason.length).toFixed(2),
            walkRating: Number(teamStatsSeasonAvg.walkRating / teamStatsSeason.length).toFixed(2),
            opsRating: Number(teamStatsSeasonAvg.opsRating / teamStatsSeason.length).toFixed(2),
            winRating: Number(teamStatsSeasonAvg.winRating / teamStatsSeason.length).toFixed(2),
            eraRating: Number(teamStatsSeasonAvg.eraRating / teamStatsSeason.length).toFixed(2),
            whipRating: Number(teamStatsSeasonAvg.whipRating / teamStatsSeason.length).toFixed(2),
            ipRating: Number(teamStatsSeasonAvg.ipRating / teamStatsSeason.length).toFixed(2),
            svRating: Number(teamStatsSeasonAvg.svRating / teamStatsSeason.length).toFixed(2),
            kRating: Number(teamStatsSeasonAvg.kRating / teamStatsSeason.length).toFixed(2),
            holdRating: Number(teamStatsSeasonAvg.holdRating / teamStatsSeason.length).toFixed(2),
            saveholdRating: Number(teamStatsSeasonAvg.saveholdRating / teamStatsSeason.length).toFixed(2),
            k9Rating: Number(teamStatsSeasonAvg.k9Rating / teamStatsSeason.length).toFixed(2)
        }

        teamStatsRecentAvg = {
            overallRating: Number(teamStatsRecentAvg.overallRating / teamStatsRecent.length).toFixed(2),
            runRating: Number(teamStatsRecentAvg.runRating / teamStatsRecent.length).toFixed(2),
            rbiRating: Number(teamStatsRecentAvg.rbiRating / teamStatsRecent.length).toFixed(2),
            homeRunRating: Number(teamStatsRecentAvg.homeRunRating / teamStatsRecent.length).toFixed(2),
            sbRating: Number(teamStatsRecentAvg.sbRating / teamStatsRecent.length).toFixed(2),
            obpRating: Number(teamStatsRecentAvg.obpRating / teamStatsRecent.length).toFixed(2),
            slgRating: Number(teamStatsRecentAvg.slgRating / teamStatsRecent.length).toFixed(2),
            doubleRating: Number(teamStatsRecentAvg.doubleRating / teamStatsRecent.length).toFixed(2),
            walkRating: Number(teamStatsRecentAvg.walkRating / teamStatsRecent.length).toFixed(2),
            opsRating: Number(teamStatsRecentAvg.opsRating / teamStatsRecent.length).toFixed(2),
            winRating: Number(teamStatsRecentAvg.winRating / teamStatsRecent.length).toFixed(2),
            eraRating: Number(teamStatsRecentAvg.eraRating / teamStatsRecent.length).toFixed(2),
            whipRating: Number(teamStatsRecentAvg.whipRating / teamStatsRecent.length).toFixed(2),
            ipRating: Number(teamStatsRecentAvg.ipRating / teamStatsRecent.length).toFixed(2),
            svRating: Number(teamStatsRecentAvg.svRating / teamStatsRecent.length).toFixed(2),
            kRating: Number(teamStatsRecentAvg.kRating / teamStatsRecent.length).toFixed(2),
            holdRating: Number(teamStatsRecentAvg.holdRating / teamStatsRecent.length).toFixed(2),
            saveholdRating: Number(teamStatsRecentAvg.saveholdRating / teamStatsRecent.length).toFixed(2),
            k9Rating: Number(teamStatsRecentAvg.k9Rating / teamStatsRecent.length).toFixed(2)
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

        //column names for the main player columns
        const columnNames = [{
            Header: 'Rank',
            accessor: rankHeader,
            minWidth: 60,
            className: "center"
        }, {
            Header: 'Value',
            accessor: ratingHeader,
            minWidth: 60,
            className: "center"
        }, {
            Header: 'Name',
            accessor: nameHeader,
            width: 200,
            className: "center"
        }, {
            Header: 'Avg',
            accessor: avgHeader,
            minWidth: 60,
            className: "center",
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
            minWidth: 60,
            className: "center",
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
            className: "center",
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
            minWidth: 60,
            className: "center",
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
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
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            width: 200,
            className: "center",
            Cell: row => (
                <div>Stats per game</div>
            )
        }, {
            headerClassName: 'hide',
            minWidth: 60,
            accessor: 'avg',
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'run',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'rbi',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'hr',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'sb',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'obp',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'slg',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'double',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'walk',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ops',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'win',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'era',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'whip',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ip',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'sv',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'k',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'hold',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'savehold',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'k9',
            minWidth: 60,
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
            showStatsText = 'Use BasketballMonster Rankings';
        } else {
            showStatsText = 'Use FantasyBasketball.io Rankings';
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
            loading =
                <div className="site-loading flex">
                    <div className="site-loading-text">Loading...</div>
                </div>;
        }

        return (
            <div className="table-container flex-vertical">
                {loading}
                <div className="table-info-container flex-vertical">
                    <div className="table-info-headers flex">
                        {/* <div className="table-info-header" onClick={this.changeRankings}>{showRankingsText}</div>
                        <div className="table-info-header" onClick={this.changeStats}>{showStatsText}</div> */}
                    </div>
                    <div className="table-info-tables">
                        <div className="table-group">
                            <div className={`team-table-container ${this.state.showRecentRankings ? 'hide' : ''}`}>
                                <h3 className="team-table-header">Team Rankings</h3>
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
                            <h3 className="team-table-header">Team Rankings</h3>
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
                            <h3 className="team-table-header">Potential Pickup Targets</h3>
                            <div className="team-table">
                                <ReactTable
                                    data={this.state.playerPickupsSeason}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
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

                        <div className={`team-table-container ${this.state.showRecentRankings ? '' : 'hide'}`}>
                            <h3 className="team-table-header">Potential Pickup Targets</h3>
                            <div className="team-table">
                                <ReactTable
                                    data={this.state.playerPickupsRecent}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
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
                </div>
            </div>
        )
    }
}