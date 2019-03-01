import React, { Component } from 'react';
import Cookies from 'js-cookie';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import stringSimilarity from 'string-similarity';
import { CompareTeams } from './CompareTeams';
import { callApi } from './CallApi';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-135378238-1');
ReactGA.pageview("/?logged-in=true");

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
                    teamStatsSeasonAvg = {
                        overallRating: (teamStatsSeasonAvg.overallRating) ? (teamStatsSeasonAvg.overallRating + playerRankingsSeason[j].overallRating) : playerRankingsSeason[j].overallRating,
                        ptsRating: (teamStatsSeasonAvg.ptsRating) ? (teamStatsSeasonAvg.ptsRating + playerRankingsSeason[j].ptsRating) : playerRankingsSeason[j].ptsRating,
                        threeRating: (teamStatsSeasonAvg.threeRating) ? (teamStatsSeasonAvg.threeRating + playerRankingsSeason[j].threeRating) : playerRankingsSeason[j].threeRating,
                        astRating: (teamStatsSeasonAvg.astRating) ? (teamStatsSeasonAvg.astRating + playerRankingsSeason[j].astRating) : playerRankingsSeason[j].astRating,
                        rebRating: (teamStatsSeasonAvg.rebRating) ? (teamStatsSeasonAvg.rebRating + playerRankingsSeason[j].rebRating) : playerRankingsSeason[j].rebRating,
                        stlRating: (teamStatsSeasonAvg.stlRating) ? (teamStatsSeasonAvg.stlRating + playerRankingsSeason[j].stlRating) : playerRankingsSeason[j].stlRating,
                        blkRating: (teamStatsSeasonAvg.blkRating) ? (teamStatsSeasonAvg.blkRating + playerRankingsSeason[j].blkRating) : playerRankingsSeason[j].blkRating,
                        fgMixedRating: (teamStatsSeasonAvg.fgMixedRating) ? (teamStatsSeasonAvg.fgMixedRating + playerRankingsSeason[j].fgMixedRating) : playerRankingsSeason[j].fgMixedRating,
                        ftMixedRating: (teamStatsSeasonAvg.ftMixedRating) ? (teamStatsSeasonAvg.ftMixedRating + playerRankingsSeason[j].ftMixedRating) : playerRankingsSeason[j].ftMixedRating,
                        toRating: (teamStatsSeasonAvg.toRating) ? (teamStatsSeasonAvg.toRating + playerRankingsSeason[j].toRating) : playerRankingsSeason[j].toRating
                    }
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
                        ptsRating: (teamStatsRecentAvg.ptsRating) ? (teamStatsRecentAvg.ptsRating + playerRankingsRecent[j].ptsRating) : playerRankingsRecent[j].ptsRating,
                        threeRating: (teamStatsRecentAvg.threeRating) ? (teamStatsRecentAvg.threeRating + playerRankingsRecent[j].threeRating) : playerRankingsRecent[j].threeRating,
                        astRating: (teamStatsRecentAvg.astRating) ? (teamStatsRecentAvg.astRating + playerRankingsRecent[j].astRating) : playerRankingsRecent[j].astRating,
                        rebRating: (teamStatsRecentAvg.rebRating) ? (teamStatsRecentAvg.rebRating + playerRankingsRecent[j].rebRating) : playerRankingsRecent[j].rebRating,
                        stlRating: (teamStatsRecentAvg.stlRating) ? (teamStatsRecentAvg.stlRating + playerRankingsRecent[j].stlRating) : playerRankingsRecent[j].stlRating,
                        blkRating: (teamStatsRecentAvg.blkRating) ? (teamStatsRecentAvg.blkRating + playerRankingsRecent[j].blkRating) : playerRankingsRecent[j].blkRating,
                        fgMixedRating: (teamStatsRecentAvg.fgMixedRating) ? (teamStatsRecentAvg.fgMixedRating + playerRankingsRecent[j].fgMixedRating) : playerRankingsRecent[j].fgMixedRating,
                        ftMixedRating: (teamStatsRecentAvg.ftMixedRating) ? (teamStatsRecentAvg.ftMixedRating + playerRankingsRecent[j].ftMixedRating) : playerRankingsRecent[j].ftMixedRating,
                        toRating: (teamStatsRecentAvg.toRating) ? (teamStatsRecentAvg.toRating + playerRankingsRecent[j].toRating) : playerRankingsRecent[j].toRating
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
            ptsRating: Number(teamStatsSeasonAvg.ptsRating / teamStatsSeason.length).toFixed(2),
            threeRating: Number(teamStatsSeasonAvg.threeRating / teamStatsSeason.length).toFixed(2),
            astRating: Number(teamStatsSeasonAvg.astRating / teamStatsSeason.length).toFixed(2),
            rebRating: Number(teamStatsSeasonAvg.rebRating / teamStatsSeason.length).toFixed(2),
            stlRating: Number(teamStatsSeasonAvg.stlRating / teamStatsSeason.length).toFixed(2),
            blkRating: Number(teamStatsSeasonAvg.blkRating / teamStatsSeason.length).toFixed(2),
            fgMixedRating: Number(teamStatsSeasonAvg.fgMixedRating / teamStatsSeason.length).toFixed(2),
            ftMixedRating: Number(teamStatsSeasonAvg.ftMixedRating / teamStatsSeason.length).toFixed(2),
            toRating: Number(teamStatsSeasonAvg.toRating / teamStatsSeason.length).toFixed(2)
        }


        teamStatsRecentAvg = {
            overallRating: Number(teamStatsRecentAvg.overallRating / teamStatsRecent.length).toFixed(2),
            ptsRating: Number(teamStatsRecentAvg.ptsRating / teamStatsRecent.length).toFixed(2),
            threeRating: Number(teamStatsRecentAvg.threeRating / teamStatsRecent.length).toFixed(2),
            astRating: Number(teamStatsRecentAvg.astRating / teamStatsRecent.length).toFixed(2),
            rebRating: Number(teamStatsRecentAvg.rebRating / teamStatsRecent.length).toFixed(2),
            stlRating: Number(teamStatsRecentAvg.stlRating / teamStatsRecent.length).toFixed(2),
            blkRating: Number(teamStatsRecentAvg.blkRating / teamStatsRecent.length).toFixed(2),
            fgMixedRating: Number(teamStatsRecentAvg.fgMixedRating / teamStatsRecent.length).toFixed(2),
            ftMixedRating: Number(teamStatsRecentAvg.ftMixedRating / teamStatsRecent.length).toFixed(2),
            toRating: Number(teamStatsRecentAvg.toRating / teamStatsRecent.length).toFixed(2)
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
        var nameHeader = '';
        var rankHeader = '';
        var ratingHeader = '';
        var ptsHeader = '';
        var threesHeader = '';
        var rebHeader = '';
        var astHeader = '';
        var stlHeader = '';
        var blkHeader = '';
        var ftHeader = '';
        var fgHeader = '';
        var toHeader = '';
        nameHeader = 'playerName';
        rankHeader = 'overallRank';
        ratingHeader = 'overallRating';
        ptsHeader = 'ptsRating';
        threesHeader = 'threeRating';
        rebHeader = 'rebRating';
        astHeader = 'astRating';
        stlHeader = 'stlRating';
        blkHeader = 'blkRating';
        ftHeader = 'ftMixedRating';
        fgHeader = 'fgMixedRating';
        toHeader = 'toRating';

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
            Header: 'Points',
            accessor: ptsHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ptsHeader] > 2 ? brightGreen :
                            rowInfo.row[ptsHeader] > 1 ? mediumGreen :
                                rowInfo.row[ptsHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ptsHeader] < 0 && rowInfo.row[ptsHeader] > -1 ? lightRed :
                                        rowInfo.row[ptsHeader] <= -1 && rowInfo.row[ptsHeader] > -2 ? mediumRed :
                                            rowInfo.row[ptsHeader] <= -2 ? brightRed : null,
                    }
                };
            },

        }, {
            Header: '3s',
            accessor: threesHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[threesHeader] > 2 ? brightGreen :
                            rowInfo.row[threesHeader] > 1 ? mediumGreen :
                                rowInfo.row[threesHeader] >= .5 ? lightGreen :
                                    rowInfo.row[threesHeader] < 0 && rowInfo.row[threesHeader] > -1 ? lightRed :
                                        rowInfo.row[threesHeader] <= -1 && rowInfo.row[threesHeader] > -2 ? mediumRed :
                                            rowInfo.row[threesHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Rebounds',
            accessor: rebHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rebHeader] > 2 ? brightGreen :
                            rowInfo.row[rebHeader] > 1 ? mediumGreen :
                                rowInfo.row[rebHeader] >= .5 ? lightGreen :
                                    rowInfo.row[rebHeader] < 0 && rowInfo.row[rebHeader] > -1 ? lightRed :
                                        rowInfo.row[rebHeader] <= -1 && rowInfo.row[rebHeader] > -2 ? mediumRed :
                                            rowInfo.row[rebHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Assists',
            accessor: astHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[astHeader] > 2 ? brightGreen :
                            rowInfo.row[astHeader] > 1 ? mediumGreen :
                                rowInfo.row[astHeader] >= .5 ? lightGreen :
                                    rowInfo.row[astHeader] < 0 && rowInfo.row[astHeader] > -1 ? lightRed :
                                        rowInfo.row[astHeader] <= -1 && rowInfo.row[astHeader] > -2 ? mediumRed :
                                            rowInfo.row[astHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Steals',
            accessor: stlHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[stlHeader] > 2 ? brightGreen :
                            rowInfo.row[stlHeader] > 1 ? mediumGreen :
                                rowInfo.row[stlHeader] >= .5 ? lightGreen :
                                    rowInfo.row[stlHeader] < 0 && rowInfo.row[stlHeader] > -1 ? lightRed :
                                        rowInfo.row[stlHeader] <= -1 && rowInfo.row[stlHeader] > -2 ? mediumRed :
                                            rowInfo.row[stlHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Blocks',
            accessor: blkHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[blkHeader] > 2 ? brightGreen :
                            rowInfo.row[blkHeader] > 1 ? mediumGreen :
                                rowInfo.row[blkHeader] >= .5 ? lightGreen :
                                    rowInfo.row[blkHeader] < 0 && rowInfo.row[blkHeader] > -1 ? lightRed :
                                        rowInfo.row[blkHeader] <= -1 && rowInfo.row[blkHeader] > -2 ? mediumRed :
                                            rowInfo.row[blkHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'FG%',
            accessor: fgHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[fgHeader] > 2 ? brightGreen :
                            rowInfo.row[fgHeader] > 1 ? mediumGreen :
                                rowInfo.row[fgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[fgHeader] < 0 && rowInfo.row[fgHeader] > -1 ? lightRed :
                                        rowInfo.row[fgHeader] <= -1 && rowInfo.row[fgHeader] > -2 ? mediumRed :
                                            rowInfo.row[fgHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'FT%',
            accessor: ftHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ftHeader] > 2 ? brightGreen :
                            rowInfo.row[ftHeader] > 1 ? mediumGreen :
                                rowInfo.row[ftHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ftHeader] < 0 && rowInfo.row[ftHeader] > -1 ? lightRed :
                                        rowInfo.row[ftHeader] <= -1 && rowInfo.row[ftHeader] > -2 ? mediumRed :
                                            rowInfo.row[ftHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Turnovers',
            accessor: toHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[toHeader] > 2 ? brightGreen :
                            rowInfo.row[toHeader] > 1 ? mediumGreen :
                                rowInfo.row[toHeader] >= .5 ? lightGreen :
                                    rowInfo.row[toHeader] < 0 && rowInfo.row[toHeader] > -1 ? lightRed :
                                        rowInfo.row[toHeader] <= -1 && rowInfo.row[toHeader] > -2 ? mediumRed :
                                            rowInfo.row[toHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }];

        //column names for the average tables
        const columnNamesAvg = [{
            Header: 'Points',
            accessor: ptsHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ptsHeader] > 1 ? brightGreen :
                            rowInfo.row[ptsHeader] > .5 ? mediumGreen :
                                rowInfo.row[ptsHeader] >= .25 ? lightGreen :
                                    rowInfo.row[ptsHeader] < 0 && rowInfo.row[ptsHeader] > -0.25 ? lightRed :
                                        rowInfo.row[ptsHeader] < -0.25 && rowInfo.row[ptsHeader] > -1 ? mediumRed :
                                            rowInfo.row[ptsHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: '3s',
            accessor: threesHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[threesHeader] > 1 ? brightGreen :
                            rowInfo.row[threesHeader] > .5 ? mediumGreen :
                                rowInfo.row[threesHeader] >= .25 ? lightGreen :
                                    rowInfo.row[threesHeader] < 0 && rowInfo.row[threesHeader] > -0.25 ? lightRed :
                                        rowInfo.row[threesHeader] < -0.25 && rowInfo.row[threesHeader] > -1 ? mediumRed :
                                            rowInfo.row[threesHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Rebounds',
            accessor: rebHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rebHeader] > 1 ? brightGreen :
                            rowInfo.row[rebHeader] > .5 ? mediumGreen :
                                rowInfo.row[rebHeader] >= .25 ? lightGreen :
                                    rowInfo.row[rebHeader] < 0 && rowInfo.row[rebHeader] > -0.25 ? lightRed :
                                        rowInfo.row[rebHeader] < -0.25 && rowInfo.row[rebHeader] > -1 ? mediumRed :
                                            rowInfo.row[rebHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Assists',
            accessor: astHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[astHeader] > 1 ? brightGreen :
                            rowInfo.row[astHeader] > .5 ? mediumGreen :
                                rowInfo.row[astHeader] >= .25 ? lightGreen :
                                    rowInfo.row[astHeader] < 0 && rowInfo.row[astHeader] > -0.25 ? lightRed :
                                        rowInfo.row[astHeader] < -0.25 && rowInfo.row[astHeader] > -1 ? mediumRed :
                                            rowInfo.row[astHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Steals',
            accessor: stlHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[stlHeader] > 1 ? brightGreen :
                            rowInfo.row[stlHeader] > .5 ? mediumGreen :
                                rowInfo.row[stlHeader] >= .25 ? lightGreen :
                                    rowInfo.row[stlHeader] < 0 && rowInfo.row[stlHeader] > -0.25 ? lightRed :
                                        rowInfo.row[stlHeader] < -0.25 && rowInfo.row[stlHeader] > -1 ? mediumRed :
                                            rowInfo.row[stlHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Blocks',
            accessor: blkHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[blkHeader] > 1 ? brightGreen :
                            rowInfo.row[blkHeader] > .5 ? mediumGreen :
                                rowInfo.row[blkHeader] >= .25 ? lightGreen :
                                    rowInfo.row[blkHeader] < 0 && rowInfo.row[blkHeader] > -0.25 ? lightRed :
                                        rowInfo.row[blkHeader] < -0.25 && rowInfo.row[blkHeader] > -1 ? mediumRed :
                                            rowInfo.row[blkHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'FG%',
            accessor: fgHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[fgHeader] > 1 ? brightGreen :
                            rowInfo.row[fgHeader] > .5 ? mediumGreen :
                                rowInfo.row[fgHeader] >= .25 ? lightGreen :
                                    rowInfo.row[fgHeader] < 0 && rowInfo.row[fgHeader] > -0.25 ? lightRed :
                                        rowInfo.row[fgHeader] < -0.25 && rowInfo.row[fgHeader] > -1 ? mediumRed :
                                            rowInfo.row[fgHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'FT%',
            accessor: ftHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ftHeader] > 1 ? brightGreen :
                            rowInfo.row[ftHeader] > .5 ? mediumGreen :
                                rowInfo.row[ftHeader] >= .25 ? lightGreen :
                                    rowInfo.row[ftHeader] < 0 && rowInfo.row[ftHeader] > -0.25 ? lightRed :
                                        rowInfo.row[ftHeader] < -0.25 && rowInfo.row[ftHeader] > -1 ? mediumRed :
                                            rowInfo.row[ftHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'Turnovers',
            accessor: toHeader,
            className: "center",
            minWidth: 60,
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[toHeader] > 1 ? brightGreen :
                            rowInfo.row[toHeader] > .5 ? mediumGreen :
                                rowInfo.row[toHeader] >= .25 ? lightGreen :
                                    rowInfo.row[toHeader] < 0 && rowInfo.row[toHeader] > -0.25 ? lightRed :
                                        rowInfo.row[toHeader] < -0.25 && rowInfo.row[toHeader] > -1 ? mediumRed :
                                            rowInfo.row[toHeader] <= -1 ? brightRed : null,
                    }
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
            accessor: 'pts',
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'fG3M',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'reb',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ast',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'stl',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'blk',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'fgPct',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'ftPct',
            minWidth: 60,
            className: "center"
        }, {
            headerClassName: 'hide',
            accessor: 'tov',
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
                        <div className="table-info-header" onClick={this.changeRankings}>{showRankingsText}</div>
                        <div className="table-info-header" onClick={this.changeStats}>{showStatsText}</div>
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