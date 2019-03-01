import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Cookies from 'js-cookie';
import Select from 'react-select';
import stringSimilarity from 'string-similarity';
import { callApi } from './CallApi';
import { TradeModal } from './TradeModal'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-135378238-1');
ReactGA.pageview("/trade");

export class TradeAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leagueId: [],
            teamId: [],
            teams: [],
            teamStatsSeason: [],
            teamStatsRecent: [],
            teamStatsSeasonAvg: [],
            teamStatsRecentAvg: [],
            teamStatsSeasonOrig: [],
            teamStatsRecentOrig: [],
            playerRankingsSeason: [],
            playerRankingsRecent: [],
            playerRankingsBBMSeason: [],
            playerRankingsBBMRecent: [],
            playerRankingsLocalSeason: [],
            playerRankingsLocalRecent: [],
            compareStatsSeason: [],
            compareStatsRecent: [],
            teamSelected: [],
            teamPlayers: [],
            teamPlayersTrade: [],
            showCompareTable: false,
            teamTradeStatsSeason: [],
            oppTeamTradeStatsSeason: [],
            teamTradeImprovement: [],
            selected: [],
            selectedOpp: [],
            updateCompareTable: false,
            showBBMStats: false,
            showRecentStats: false
        }
        this.hideCompareTable = this.hideCompareTable.bind(this);
        this.changeBBMStats = this.changeBBMStats.bind(this);
        this.changeRecentStats = this.changeRecentStats.bind(this);
    }

    componentDidMount() {
        var leagueId = Cookies.get('leagueId');
        var teamId = Cookies.get('teamId');
        var seasonStats = JSON.parse(localStorage.getItem('teamStatsSeason'));
        var recentStats = JSON.parse(localStorage.getItem('teamStatsRecent'));
        var seasonAvg = JSON.parse(localStorage.getItem('teamStatsSeasonAvg'));
        var teamTradeImprovement = [];

        var recentAvg = JSON.parse(localStorage.getItem('teamStatsRecentAvg'));
        this.setState({
            teamStatsSeasonOrig: seasonAvg,
            teamStatsRecentOrig: recentAvg
        })

        var teamTradeStatsSeason = JSON.parse(localStorage.getItem('teamTradeStatsSeason'));
        var oppTeamTradeStatsSeason = JSON.parse(localStorage.getItem('oppTeamTradeStatsSeason'));

        if (teamTradeStatsSeason || oppTeamTradeStatsSeason) {
            var selected = JSON.parse(localStorage.getItem('selected'));
            var selectedOpp = JSON.parse(localStorage.getItem('selectedOpp'));
            var overallRating = 0;
            var ptsRating = 0;
            var threeRating = 0;
            var astRating = 0;
            var rebRating = 0;
            var stlRating = 0;
            var blkRating = 0;
            var fgMixedRating = 0;
            var ftMixedRating = 0;
            var toRating = 0;

            this.setState({
                teamTradeStatsSeason: teamTradeStatsSeason,
                oppTeamTradeStatsSeason: oppTeamTradeStatsSeason,
                selected: selected,
                selectedOpp: selectedOpp
            })

            for (var i = 0; i < teamTradeStatsSeason.length; i++) {
                overallRating = Number(parseFloat(overallRating) - parseFloat(teamTradeStatsSeason[i].overallRating)).toFixed(2);
                ptsRating = Number(parseFloat(ptsRating) - parseFloat(teamTradeStatsSeason[i].ptsRating)).toFixed(2);
                threeRating = Number(parseFloat(threeRating) - parseFloat(teamTradeStatsSeason[i].threeRating)).toFixed(2);
                astRating = Number(parseFloat(astRating) - parseFloat(teamTradeStatsSeason[i].astRating)).toFixed(2);
                rebRating = Number(parseFloat(rebRating) - parseFloat(teamTradeStatsSeason[i].rebRating)).toFixed(2);
                stlRating = Number(parseFloat(stlRating) - parseFloat(teamTradeStatsSeason[i].stlRating)).toFixed(2);
                blkRating = Number(parseFloat(blkRating) - parseFloat(teamTradeStatsSeason[i].blkRating)).toFixed(2);
                fgMixedRating = Number(parseFloat(fgMixedRating) - parseFloat(teamTradeStatsSeason[i].fgMixedRating)).toFixed(2);
                ftMixedRating = Number(parseFloat(ftMixedRating) - parseFloat(teamTradeStatsSeason[i].ftMixedRating)).toFixed(2);
                toRating = Number(parseFloat(toRating) - parseFloat(teamTradeStatsSeason[i].toRating)).toFixed(2);
            }

            for (i = 0; i < oppTeamTradeStatsSeason.length; i++) {
                overallRating = Number(parseFloat(overallRating) + parseFloat(oppTeamTradeStatsSeason[i].overallRating)).toFixed(2);
                ptsRating = Number(parseFloat(ptsRating) + parseFloat(oppTeamTradeStatsSeason[i].ptsRating)).toFixed(2);
                threeRating = Number(parseFloat(threeRating) + parseFloat(oppTeamTradeStatsSeason[i].threeRating)).toFixed(2);
                astRating = Number(parseFloat(astRating) + parseFloat(oppTeamTradeStatsSeason[i].astRating)).toFixed(2);
                rebRating = Number(parseFloat(rebRating) + parseFloat(oppTeamTradeStatsSeason[i].rebRating)).toFixed(2);
                stlRating = Number(parseFloat(stlRating) + parseFloat(oppTeamTradeStatsSeason[i].stlRating)).toFixed(2);
                blkRating = Number(parseFloat(blkRating) + parseFloat(oppTeamTradeStatsSeason[i].blkRating)).toFixed(2);
                fgMixedRating = Number(parseFloat(fgMixedRating) + parseFloat(oppTeamTradeStatsSeason[i].fgMixedRating)).toFixed(2);
                ftMixedRating = Number(parseFloat(ftMixedRating) + parseFloat(oppTeamTradeStatsSeason[i].ftMixedRating)).toFixed(2);
                toRating = Number(parseFloat(toRating) + parseFloat(oppTeamTradeStatsSeason[i].toRating)).toFixed(2);
            }

            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: overallRating,
                ptsRating: ptsRating,
                threeRating: threeRating,
                astRating: astRating,
                rebRating: rebRating,
                stlRating: stlRating,
                blkRating: blkRating,
                fgMixedRating: fgMixedRating,
                ftMixedRating: ftMixedRating,
                toRating: toRating
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                ptsRating: seasonAvg[0].ptsRating,
                threeRating: seasonAvg[0].threeRating,
                astRating: seasonAvg[0].astRating,
                rebRating: seasonAvg[0].rebRating,
                stlRating: seasonAvg[0].stlRating,
                blkRating: seasonAvg[0].blkRating,
                fgMixedRating: seasonAvg[0].fgMixedRating,
                ftMixedRating: seasonAvg[0].ftMixedRating,
                toRating: seasonAvg[0].toRating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(seasonAvg[0].overallRating) + parseFloat(overallRating)).toFixed(2),
                ptsRating: Number(parseFloat(seasonAvg[0].ptsRating) + parseFloat(ptsRating)).toFixed(2),
                threeRating: Number(parseFloat(seasonAvg[0].threeRating) + parseFloat(threeRating)).toFixed(2),
                astRating: Number(parseFloat(seasonAvg[0].astRating) + parseFloat(astRating)).toFixed(2),
                rebRating: Number(parseFloat(seasonAvg[0].rebRating) + parseFloat(rebRating)).toFixed(2),
                stlRating: Number(parseFloat(seasonAvg[0].stlRating) + parseFloat(stlRating)).toFixed(2),
                blkRating: Number(parseFloat(seasonAvg[0].blkRating) + parseFloat(blkRating)).toFixed(2),
                fgMixedRating: Number(parseFloat(seasonAvg[0].fgMixedRating) + parseFloat(fgMixedRating)).toFixed(2),
                ftMixedRating: Number(parseFloat(seasonAvg[0].ftMixedRating) + parseFloat(ftMixedRating)).toFixed(2),
                toRating: Number(parseFloat(seasonAvg[0].toRating) + parseFloat(toRating)).toFixed(2)
            });

        } else {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: 0,
                ptsRating: 0,
                threeRating: 0,
                astRating: 0,
                rebRating: 0,
                stlRating: 0,
                blkRating: 0,
                fgMixedRating: 0,
                ftMixedRating: 0,
                toRating: 0
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                ptsRating: seasonAvg[0].ptsRating,
                threeRating: seasonAvg[0].threeRating,
                astRating: seasonAvg[0].astRating,
                rebRating: seasonAvg[0].rebRating,
                stlRating: seasonAvg[0].stlRating,
                blkRating: seasonAvg[0].blkRating,
                fgMixedRating: seasonAvg[0].fgMixedRating,
                ftMixedRating: seasonAvg[0].ftMixedRating,
                toRating: seasonAvg[0].toRating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: seasonAvg[0].overallRating,
                ptsRating: seasonAvg[0].ptsRating,
                threeRating: seasonAvg[0].threeRating,
                astRating: seasonAvg[0].astRating,
                rebRating: seasonAvg[0].rebRating,
                stlRating: seasonAvg[0].stlRating,
                blkRating: seasonAvg[0].blkRating,
                fgMixedRating: seasonAvg[0].fgMixedRating,
                ftMixedRating: seasonAvg[0].ftMixedRating,
                toRating: seasonAvg[0].toRating
            });
        }

        //If any of these do not exist somehow (not sure how, but still), redirect to home page to be rebuilt
        if (seasonStats === null || recentStats === null || seasonAvg === null || recentAvg === null) {
            window.location = "/";
        } else {
            this.setState({
                leagueId: leagueId,
                teamId: teamId,
                teamStatsSeason: seasonStats,
                teamStatsRecent: recentStats,
                teamStatsSeasonAvg: seasonAvg,
                teamStatsRecentAvg: recentAvg,
                playerRankingsSeason: JSON.parse(localStorage.getItem('playerRankingsSeason')),
                playerRankingsRecent: JSON.parse(localStorage.getItem('playerRankingsRecent')),
                playerRankingsBBMSeason: JSON.parse(localStorage.getItem('playerRankingsBBMSeason')),
                playerRankingsBBMRecent: JSON.parse(localStorage.getItem('playerRankingsBBMRecent')),
                playerRankingsLocalSeason: JSON.parse(localStorage.getItem('playerRankingsLocalSeason')),
                playerRankingsLocalRecent: JSON.parse(localStorage.getItem('playerRankingsLocalRecent')),
                teams: JSON.parse(localStorage.getItem('teams')),
                teamPlayers: JSON.parse(localStorage.getItem('teamPlayers')),
                teamTradeImprovement: teamTradeImprovement
            }, function () {
                var compareTeam = Cookies.get('teamTradeSelectedValue');
                if (compareTeam) {
                    var teamTradeSelected = {
                        value: compareTeam,
                        label: Cookies.get('teamTradeSelectedLabel')
                    };

                    this.handleTeamChange(teamTradeSelected)
                }
            });
        }
    }

    handleTeamChange = (teamSelected) => {
        this.setState({ teamSelected });
        callApi('/api/teams/' + this.state.leagueId + '/' + teamSelected.value)
            .then(results => {
                this.setState({ showCompareTable: true });
                this.setState({ teamPlayersTrade: results }, function () {
                    this.buildTradeTeam(this.state.teamPlayersTrade);
                    Cookies.set('teamTradeSelectedValue', teamSelected.value);
                    Cookies.set('teamTradeSelectedLabel', teamSelected.label);
                })
            })
            .catch(err => console.log(err));
    }

    //hide the compare table when clicked
    hideCompareTable() {
        this.setState({ showCompareTable: false });
        Cookies.remove('teamTradeSelectedValue');
        Cookies.remove('teamTradeSelectedLabel');
    }

    buildTeam() {
        var teamStatsSeason = [];
        var teamStatsRecent = [];
        var teamStatsSeasonAvg = [];
        var teamStatsRecentAvg = [];
        var teamPlayers = this.state.teamPlayers;
        var playerRankingsSeason = this.state.playerRankingsSeason;
        var playerRankingsRecent = this.state.playerRankingsRecent;

        if (this.state.showRecentStats) {
            playerRankingsSeason = playerRankingsRecent;
        }

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

        var teamTradeImprovement = [];

        if ((this.state.teamTradeStatsSeason.length === 0) && (this.state.oppTeamTradeStatsSeason.length === 0)) {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: 0,
                ptsRating: 0,
                threeRating: 0,
                astRating: 0,
                rebRating: 0,
                stlRating: 0,
                blkRating: 0,
                fgMixedRating: 0,
                ftMixedRating: 0,
                toRating: 0
            });
        } else {
            var overallRating = 0;
            var ptsRating = 0;
            var threeRating = 0;
            var astRating = 0;
            var rebRating = 0;
            var stlRating = 0;
            var blkRating = 0;
            var fgMixedRating = 0;
            var ftMixedRating = 0;
            var toRating = 0;

            for (i = 0; i < this.state.teamTradeStatsSeason.length; i++) {
                overallRating = Number(overallRating - this.state.teamTradeStatsSeason[i].overallRating).toFixed(2);
                ptsRating = Number(ptsRating - this.state.teamTradeStatsSeason[i].ptsRating).toFixed(2);
                threeRating = Number(threeRating - this.state.teamTradeStatsSeason[i].threeRating).toFixed(2);
                astRating = Number(astRating - this.state.teamTradeStatsSeason[i].astRating).toFixed(2);
                rebRating = Number(rebRating - this.state.teamTradeStatsSeason[i].rebRating).toFixed(2);
                stlRating = Number(stlRating - this.state.teamTradeStatsSeason[i].stlRating).toFixed(2);
                blkRating = Number(blkRating - this.state.teamTradeStatsSeason[i].blkRating).toFixed(2);
                fgMixedRating = Number(fgMixedRating - this.state.teamTradeStatsSeason[i].fgMixedRating).toFixed(2);
                ftMixedRating = Number(ftMixedRating - this.state.teamTradeStatsSeason[i].ftMixedRating).toFixed(2);
                toRating = Number(toRating - this.state.teamTradeStatsSeason[i].toRating).toFixed(2);
            }

            for (j = 0; j < this.state.oppTeamTradeStatsSeason.length; j++) {
                overallRating = Number(parseFloat(overallRating) + this.state.oppTeamTradeStatsSeason[j].overallRating).toFixed(2);
                ptsRating = Number(parseFloat(ptsRating) + this.state.oppTeamTradeStatsSeason[j].ptsRating).toFixed(2);
                threeRating = Number(parseFloat(threeRating) + this.state.oppTeamTradeStatsSeason[j].threeRating).toFixed(2);
                astRating = Number(parseFloat(astRating) + this.state.oppTeamTradeStatsSeason[j].astRating).toFixed(2);
                rebRating = Number(parseFloat(rebRating) + this.state.oppTeamTradeStatsSeason[j].rebRating).toFixed(2);
                stlRating = Number(parseFloat(stlRating) + this.state.oppTeamTradeStatsSeason[j].stlRating).toFixed(2);
                blkRating = Number(parseFloat(blkRating) + this.state.oppTeamTradeStatsSeason[j].blkRating).toFixed(2);
                fgMixedRating = Number(parseFloat(fgMixedRating) + this.state.oppTeamTradeStatsSeason[j].fgMixedRating).toFixed(2);
                ftMixedRating = Number(parseFloat(ftMixedRating) + this.state.oppTeamTradeStatsSeason[j].ftMixedRating).toFixed(2);
                toRating = Number(parseFloat(toRating) + this.state.oppTeamTradeStatsSeason[j].toRating).toFixed(2);
            }
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: overallRating,
                ptsRating: ptsRating,
                threeRating: threeRating,
                astRating: astRating,
                rebRating: rebRating,
                stlRating: stlRating,
                blkRating: blkRating,
                fgMixedRating: fgMixedRating,
                ftMixedRating: ftMixedRating,
                toRating: toRating
            });
        }


        teamTradeImprovement.push({
            name: 'Current team',
            overallRating: teamStatsSeasonAvg.overallRating,
            ptsRating: teamStatsSeasonAvg.ptsRating,
            threeRating: teamStatsSeasonAvg.threeRating,
            astRating: teamStatsSeasonAvg.astRating,
            rebRating: teamStatsSeasonAvg.rebRating,
            stlRating: teamStatsSeasonAvg.stlRating,
            blkRating: teamStatsSeasonAvg.blkRating,
            fgMixedRating: teamStatsSeasonAvg.fgMixedRating,
            ftMixedRating: teamStatsSeasonAvg.ftMixedRating,
            toRating: teamStatsSeasonAvg.toRating
        });

        teamTradeImprovement.push({
            name: 'Team after trade',
            overallRating: teamStatsSeasonAvg.overallRating,
            ptsRating: teamStatsSeasonAvg.ptsRating,
            threeRating: teamStatsSeasonAvg.threeRating,
            astRating: teamStatsSeasonAvg.astRating,
            rebRating: teamStatsSeasonAvg.rebRating,
            stlRating: teamStatsSeasonAvg.stlRating,
            blkRating: teamStatsSeasonAvg.blkRating,
            fgMixedRating: teamStatsSeasonAvg.fgMixedRating,
            ftMixedRating: teamStatsSeasonAvg.ftMixedRating,
            toRating: teamStatsSeasonAvg.toRating
        });

        this.setState({
            teamStatsSeason: teamStatsSeason,
            teamStatsRecent: teamStatsRecent,
            teamTradeImprovement: teamTradeImprovement
        });
    }

    buildTradeTeam(team) {
        var teamStatsSeason = [];
        var teamStatsRecent = [];
        var teamStatsSeasonAvg = [];
        var teamStatsRecentAvg = [];
        var teamPlayersTrade = team;
        var playerRankingsSeason = this.state.playerRankingsSeason;
        var playerRankingsRecent = this.state.playerRankingsRecent;

        if (this.state.showRecentStats) {
            playerRankingsSeason = playerRankingsRecent;
        }

        //for each player on the team, if string similarity > .7 in the player rankings, then add that player to the array
        for (var i = 0; i < teamPlayersTrade.length; i++) {
            for (var j = 0; j < playerRankingsSeason.length; j++) {
                var similarPlayerSeason = stringSimilarity.compareTwoStrings(teamPlayersTrade[i].full, playerRankingsSeason[j].playerName);
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
            for (var k = 0; k < playerRankingsRecent.length; k++) {
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayersTrade[i].full, playerRankingsRecent[k].playerName);
                if (similarPlayerRecent > 0.7) {
                    teamStatsRecent.push(playerRankingsRecent[k]);
                    teamStatsRecentAvg = {
                        overallRating: (teamStatsRecentAvg.overallRating) ? (teamStatsRecentAvg.overallRating + playerRankingsRecent[k].overallRating) : playerRankingsRecent[k].overallRating,
                        ptsRating: (teamStatsRecentAvg.ptsRating) ? (teamStatsRecentAvg.ptsRating + playerRankingsRecent[k].ptsRating) : playerRankingsRecent[k].ptsRating,
                        threeRating: (teamStatsRecentAvg.threeRating) ? (teamStatsRecentAvg.threeRating + playerRankingsRecent[k].threeRating) : playerRankingsRecent[k].threeRating,
                        astRating: (teamStatsRecentAvg.astRating) ? (teamStatsRecentAvg.astRating + playerRankingsRecent[k].astRating) : playerRankingsRecent[k].astRating,
                        rebRating: (teamStatsRecentAvg.rebRating) ? (teamStatsRecentAvg.rebRating + playerRankingsRecent[k].rebRating) : playerRankingsRecent[k].rebRating,
                        stlRating: (teamStatsRecentAvg.stlRating) ? (teamStatsRecentAvg.stlRating + playerRankingsRecent[k].stlRating) : playerRankingsRecent[k].stlRating,
                        blkRating: (teamStatsRecentAvg.blkRating) ? (teamStatsRecentAvg.blkRating + playerRankingsRecent[k].blkRating) : playerRankingsRecent[k].blkRating,
                        fgMixedRating: (teamStatsRecentAvg.fgMixedRating) ? (teamStatsRecentAvg.fgMixedRating + playerRankingsRecent[k].fgMixedRating) : playerRankingsRecent[k].fgMixedRating,
                        ftMixedRating: (teamStatsRecentAvg.ftMixedRating) ? (teamStatsRecentAvg.ftMixedRating + playerRankingsRecent[k].ftMixedRating) : playerRankingsRecent[k].ftMixedRating,
                        toRating: (teamStatsRecentAvg.toRating) ? (teamStatsRecentAvg.toRating + playerRankingsRecent[k].toRating) : playerRankingsRecent[k].toRating
                    }
                    break
                }
            }
        }

        this.setState({ compareStatsSeason: teamStatsSeason });
        this.setState({ compareStatsRecent: teamStatsRecent });

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
            toRating: Number(teamStatsSeasonAvg.ftRating / teamStatsSeason.length).toFixed(2)
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
            toRating: Number(teamStatsRecentAvg.ftRating / teamStatsRecent.length).toFixed(2)
        }

        //Put the [] around the arrays so the table below can know its a single row
        this.setState({ compareStatsSeasonAvg: [teamStatsSeasonAvg] });
        this.setState({ compareStatsRecentAvg: [teamStatsRecentAvg] });
    }

    addToTeamTrade(rowInfo) {
        var teamTradeArray = this.state.teamTradeStatsSeason;
        teamTradeArray.push(rowInfo.original);
        this.setState({ teamTradeStatsSeason: teamTradeArray }, function () {
            localStorage.setItem('teamTradeStatsSeason', JSON.stringify(teamTradeArray));
        });

        this.updateImprovementTable(rowInfo, true, true);
    }

    removeFromTeamTrade(rowInfo) {
        var teamTradeArray = this.state.teamTradeStatsSeason;
        for (var i = 0; i < teamTradeArray.length; i++) {
            if (rowInfo.original._id === teamTradeArray[i]._id) {
                teamTradeArray.splice(i, 1);
            }
        }

        this.setState({ teamTradeStatsSeason: teamTradeArray });
        localStorage.setItem('teamTradeStatsSeason', JSON.stringify(teamTradeArray));
        this.updateImprovementTable(rowInfo, false, true);
    }

    addToOppTeamTrade(rowInfo) {
        var teamTradeArray = this.state.oppTeamTradeStatsSeason;
        teamTradeArray.push(rowInfo.original);
        this.setState({ oppTeamTradeStatsSeason: teamTradeArray });
        localStorage.setItem('oppTeamTradeStatsSeason', JSON.stringify(teamTradeArray));
        this.updateImprovementTable(rowInfo, true, false);
    }

    removeFromOppTeamTrade(rowInfo) {
        var teamTradeArray = this.state.oppTeamTradeStatsSeason;
        for (var i = 0; i < teamTradeArray.length; i++) {
            if (rowInfo.original._id === teamTradeArray[i]._id) {
                teamTradeArray.splice(i, 1);
            }
        }

        this.setState({ oppTeamTradeStatsSeason: teamTradeArray });
        localStorage.setItem('oppTeamTradeStatsSeason', JSON.stringify(teamTradeArray));
        this.updateImprovementTable(rowInfo, false, false);
    }

    updateImprovementTable(rowInfo, add, ownedTeam) {
        var teamTradeImprovement = [];
        var seasonAvg;
        if (!this.state.showRecentStats) {
            seasonAvg = this.state.teamStatsSeasonAvg;
        } else {
            seasonAvg = this.state.teamStatsRecentAvg;
        }

        if ((add && ownedTeam) || (!add && !ownedTeam)) {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[0].overallRating) - rowInfo.original.overallRating).toFixed(2),
                ptsRating: Number(parseFloat(this.state.teamTradeImprovement[0].ptsRating) - rowInfo.original.ptsRating).toFixed(2),
                threeRating: Number(parseFloat(this.state.teamTradeImprovement[0].threeRating) - rowInfo.original.threeRating).toFixed(2),
                astRating: Number(parseFloat(this.state.teamTradeImprovement[0].astRating) - rowInfo.original.astRating).toFixed(2),
                rebRating: Number(parseFloat(this.state.teamTradeImprovement[0].rebRating) - rowInfo.original.rebRating).toFixed(2),
                stlRating: Number(parseFloat(this.state.teamTradeImprovement[0].stlRating) - rowInfo.original.stlRating).toFixed(2),
                blkRating: Number(parseFloat(this.state.teamTradeImprovement[0].blkRating) - rowInfo.original.blkRating).toFixed(2),
                fgMixedRating: Number(parseFloat(this.state.teamTradeImprovement[0].fgMixedRating) - rowInfo.original.fgMixedRating).toFixed(2),
                ftMixedRating: Number(parseFloat(this.state.teamTradeImprovement[0].ftMixedRating) - rowInfo.original.ftMixedRating).toFixed(2),
                toRating: Number(parseFloat(this.state.teamTradeImprovement[0].toRating) - rowInfo.original.toRating).toFixed(2)
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                ptsRating: seasonAvg[0].ptsRating,
                threeRating: seasonAvg[0].threeRating,
                astRating: seasonAvg[0].astRating,
                rebRating: seasonAvg[0].rebRating,
                stlRating: seasonAvg[0].stlRating,
                blkRating: seasonAvg[0].blkRating,
                fgMixedRating: seasonAvg[0].fgMixedRating,
                ftMixedRating: seasonAvg[0].ftMixedRating,
                toRating: seasonAvg[0].toRating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[1].overallRating) + parseFloat(teamTradeImprovement[0].overallRating)).toFixed(2),
                ptsRating: Number(parseFloat(this.state.teamTradeImprovement[1].ptsRating) + parseFloat(teamTradeImprovement[0].ptsRating)).toFixed(2),
                threeRating: Number(parseFloat(this.state.teamTradeImprovement[1].threeRating) + parseFloat(teamTradeImprovement[0].threeRating)).toFixed(2),
                astRating: Number(parseFloat(this.state.teamTradeImprovement[1].astRating) + parseFloat(teamTradeImprovement[0].astRating)).toFixed(2),
                rebRating: Number(parseFloat(this.state.teamTradeImprovement[1].rebRating) + parseFloat(teamTradeImprovement[0].rebRating)).toFixed(2),
                stlRating: Number(parseFloat(this.state.teamTradeImprovement[1].stlRating) + parseFloat(teamTradeImprovement[0].stlRating)).toFixed(2),
                blkRating: Number(parseFloat(this.state.teamTradeImprovement[1].blkRating) + parseFloat(teamTradeImprovement[0].blkRating)).toFixed(2),
                fgMixedRating: Number(parseFloat(this.state.teamTradeImprovement[1].fgMixedRating) + parseFloat(teamTradeImprovement[0].fgMixedRating)).toFixed(2),
                ftMixedRating: Number(parseFloat(this.state.teamTradeImprovement[1].ftMixedRating) + parseFloat(teamTradeImprovement[0].ftMixedRating)).toFixed(2),
                toRating: Number(parseFloat(this.state.teamTradeImprovement[1].toRating) + parseFloat(teamTradeImprovement[0].toRating)).toFixed(2)
            })
        } else {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[0].overallRating) + rowInfo.original.overallRating).toFixed(2),
                ptsRating: Number(parseFloat(this.state.teamTradeImprovement[0].ptsRating) + rowInfo.original.ptsRating).toFixed(2),
                threeRating: Number(parseFloat(this.state.teamTradeImprovement[0].threeRating) + rowInfo.original.threeRating).toFixed(2),
                astRating: Number(parseFloat(this.state.teamTradeImprovement[0].astRating) + rowInfo.original.astRating).toFixed(2),
                rebRating: Number(parseFloat(this.state.teamTradeImprovement[0].rebRating) + rowInfo.original.rebRating).toFixed(2),
                stlRating: Number(parseFloat(this.state.teamTradeImprovement[0].stlRating) + rowInfo.original.stlRating).toFixed(2),
                blkRating: Number(parseFloat(this.state.teamTradeImprovement[0].blkRating) + rowInfo.original.blkRating).toFixed(2),
                fgMixedRating: Number(parseFloat(this.state.teamTradeImprovement[0].fgMixedRating) + rowInfo.original.fgMixedRating).toFixed(2),
                ftMixedRating: Number(parseFloat(this.state.teamTradeImprovement[0].ftMixedRating) + rowInfo.original.ftMixedRating).toFixed(2),
                toRating: Number(parseFloat(this.state.teamTradeImprovement[0].toRating) + rowInfo.original.toRating).toFixed(2)
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                ptsRating: seasonAvg[0].ptsRating,
                threeRating: seasonAvg[0].threeRating,
                astRating: seasonAvg[0].astRating,
                rebRating: seasonAvg[0].rebRating,
                stlRating: seasonAvg[0].stlRating,
                blkRating: seasonAvg[0].blkRating,
                fgMixedRating: seasonAvg[0].fgMixedRating,
                ftMixedRating: seasonAvg[0].ftMixedRating,
                toRating: seasonAvg[0].toRating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[1].overallRating) + parseFloat(teamTradeImprovement[0].overallRating)).toFixed(2),
                ptsRating: Number(parseFloat(this.state.teamTradeImprovement[1].ptsRating) + parseFloat(teamTradeImprovement[0].ptsRating)).toFixed(2),
                threeRating: Number(parseFloat(this.state.teamTradeImprovement[1].threeRating) + parseFloat(teamTradeImprovement[0].threeRating)).toFixed(2),
                astRating: Number(parseFloat(this.state.teamTradeImprovement[1].astRating) + parseFloat(teamTradeImprovement[0].astRating)).toFixed(2),
                rebRating: Number(parseFloat(this.state.teamTradeImprovement[1].rebRating) + parseFloat(teamTradeImprovement[0].rebRating)).toFixed(2),
                stlRating: Number(parseFloat(this.state.teamTradeImprovement[1].stlRating) + parseFloat(teamTradeImprovement[0].stlRating)).toFixed(2),
                blkRating: Number(parseFloat(this.state.teamTradeImprovement[1].blkRating) + parseFloat(teamTradeImprovement[0].blkRating)).toFixed(2),
                fgMixedRating: Number(parseFloat(this.state.teamTradeImprovement[1].fgMixedRating) + parseFloat(teamTradeImprovement[0].fgMixedRating)).toFixed(2),
                ftMixedRating: Number(parseFloat(this.state.teamTradeImprovement[1].ftMixedRating) + parseFloat(teamTradeImprovement[0].ftMixedRating)).toFixed(2),
                toRating: Number(parseFloat(this.state.teamTradeImprovement[1].toRating) + parseFloat(teamTradeImprovement[0].toRating)).toFixed(2)
            })
        }
        this.setState({ teamTradeImprovement, teamTradeImprovement });
    }

    changeBBMStats() {
        //Toggle the state to show BBM stats or local
        this.setState({ showBBMStats: !this.state.showBBMStats }, () => {
            //If BBM stats is true, load in their data
            if (this.state.showBBMStats) {
                this.setState({
                    playerRankingsSeason: this.state.playerRankingsBBMSeason,
                    playerRankingsRecent: this.state.playerRankingsBBMRecent,
                    updateCompareTable: true
                }, function () {
                    //Rebuild page with new data
                    this.buildTradeTeam(this.state.teamPlayersTrade)
                    this.buildTeam();
                    //set this state back to false to stop the constant re-render of compare table
                    this.setState({ updateCompareTable: false })
                    this.changeTradeStats();
                })
            } else {
                //If local stats is true, load the local data
                this.setState({
                    playerRankingsSeason: this.state.playerRankingsLocalSeason,
                    playerRankingsRecent: this.state.playerRankingsLocalRecent,
                    updateCompareTable: true
                }, function () {
                    //Rebuild Team with new data
                    this.buildTradeTeam(this.state.teamPlayersTrade);
                    this.buildTeam();
                    //set this state back to false to stop the constant re-render of compare table
                    this.setState({ updateCompareTable: false });
                    this.changeTradeStats();
                })
            }
        })
    }

    changeTradeStats() {
        var teamTradeUpdate = [];
        var teamTradeOppUpdate = [];


        if (!this.state.showRecentStats) {
            for (var i = 0; i < this.state.teamTradeStatsSeason.length; i++) {
                var index = this.state.playerRankingsSeason.findIndex(player => player.playerName === this.state.teamTradeStatsSeason[i].playerName)
                if (index !== -1) {
                    teamTradeUpdate.push(this.state.playerRankingsSeason[index]);
                }
            }

            for (var i = 0; i < this.state.oppTeamTradeStatsSeason.length; i++) {
                var index = this.state.playerRankingsSeason.findIndex(player => player.playerName === this.state.oppTeamTradeStatsSeason[i].playerName)
                if (index !== -1) {
                    teamTradeOppUpdate.push(this.state.playerRankingsSeason[index]);
                }
            }
        } else {
            for (var i = 0; i < this.state.teamTradeStatsSeason.length; i++) {
                var index = this.state.playerRankingsRecent.findIndex(player => player.playerName === this.state.teamTradeStatsSeason[i].playerName)
                if (index !== -1) {
                    teamTradeUpdate.push(this.state.playerRankingsRecent[index]);
                }
            }

            for (var i = 0; i < this.state.oppTeamTradeStatsSeason.length; i++) {
                var index = this.state.playerRankingsRecent.findIndex(player => player.playerName === this.state.oppTeamTradeStatsSeason[i].playerName)
                if (index !== -1) {
                    teamTradeOppUpdate.push(this.state.playerRankingsRecent[index]);
                }
            }
        }

        this.setState({
            teamTradeStatsSeason: teamTradeUpdate,
            oppTeamTradeStatsSeason: teamTradeOppUpdate
        }, function () {
            this.buildTeam();
        });
    }

    changeRecentStats() {
        this.setState({ showRecentStats: !this.state.showRecentStats }, () => {
            if (this.state.showRecentStats) {
                //Rebuild page with new data
                this.buildTradeTeam(this.state.teamPlayersTrade)
                this.changeTradeStats();
            } else {
                this.buildTradeTeam(this.state.teamPlayersTrade);
                this.changeTradeStats();
            }
        })
    }

    render() {
        var nameHeader = 'playerName';
        var rankHeader = 'overallRank';
        var ratingHeader = 'overallRating';
        var ptsHeader = 'ptsRating';
        var threesHeader = 'threeRating';
        var rebHeader = 'rebRating';
        var astHeader = 'astRating';
        var stlHeader = 'stlRating';
        var blkHeader = 'blkRating';
        var ftHeader = 'ftMixedRating';
        var fgHeader = 'fgMixedRating';
        var toHeader = 'toRating';
        const brightGreen = '#3ffc3f';
        const mediumGreen = '#85fc85';
        const lightGreen = '#b9ffb9';
        const lightRed = '#ffdfdf';
        const mediumRed = '#ffb8b8';
        const brightRed = '#ff8282';
        const white = '#ffffff'

        const { teamSelected } = this.state;
        const teamSelect = [];

        //Get the team names from a prop and push it into teamSelect for select dropdown
        for (var i = 0; i < this.state.teams.length; i++) {
            teamSelect.push({ value: this.state.teams[i].team_id, label: this.state.teams[i].name })
        }

        //If the parent says to update the table, rebuild the table with new data
        if ((this.state.updateCompareTable)) {
            this.buildTradeTeam(this.state.teamPlayersTrade);
        }

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
                                    rowInfo.row[ptsHeader] >= 0 ? white :
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
                                    rowInfo.row[threesHeader] >= 0 ? white :
                                        rowInfo.row[threesHeader] < 0 && rowInfo.row[threesHeader] > -1 ? lightRed :
                                            rowInfo.row[threesHeader] <= -1 && rowInfo.row[threesHeader] > -2 ? mediumRed :
                                                rowInfo.row[threesHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Rebounds',
            accessor: rebHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rebHeader] > 2 ? brightGreen :
                            rowInfo.row[rebHeader] > 1 ? mediumGreen :
                                rowInfo.row[rebHeader] >= .5 ? lightGreen :
                                    rowInfo.row[rebHeader] >= 0 ? white :
                                        rowInfo.row[rebHeader] < 0 && rowInfo.row[rebHeader] > -1 ? lightRed :
                                            rowInfo.row[rebHeader] <= -1 && rowInfo.row[rebHeader] > -2 ? mediumRed :
                                                rowInfo.row[rebHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Assists',
            accessor: astHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[astHeader] > 2 ? brightGreen :
                            rowInfo.row[astHeader] > 1 ? mediumGreen :
                                rowInfo.row[astHeader] >= .5 ? lightGreen :
                                    rowInfo.row[astHeader] >= 0 ? white :
                                        rowInfo.row[astHeader] < 0 && rowInfo.row[astHeader] > -1 ? lightRed :
                                            rowInfo.row[astHeader] <= -1 && rowInfo.row[astHeader] > -2 ? mediumRed :
                                                rowInfo.row[astHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Steals',
            accessor: stlHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[stlHeader] > 2 ? brightGreen :
                            rowInfo.row[stlHeader] > 1 ? mediumGreen :
                                rowInfo.row[stlHeader] >= .5 ? lightGreen :
                                    rowInfo.row[stlHeader] >= 0 ? white :
                                        rowInfo.row[stlHeader] < 0 && rowInfo.row[stlHeader] > -1 ? lightRed :
                                            rowInfo.row[stlHeader] <= -1 && rowInfo.row[stlHeader] > -2 ? mediumRed :
                                                rowInfo.row[stlHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Blocks',
            accessor: blkHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[blkHeader] > 2 ? brightGreen :
                            rowInfo.row[blkHeader] > 1 ? mediumGreen :
                                rowInfo.row[blkHeader] >= .5 ? lightGreen :
                                    rowInfo.row[blkHeader] >= 0 ? white :
                                        rowInfo.row[blkHeader] < 0 && rowInfo.row[blkHeader] > -1 ? lightRed :
                                            rowInfo.row[blkHeader] <= -1 && rowInfo.row[blkHeader] > -2 ? mediumRed :
                                                rowInfo.row[blkHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'FG%',
            accessor: fgHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[fgHeader] > 2 ? brightGreen :
                            rowInfo.row[fgHeader] > 1 ? mediumGreen :
                                rowInfo.row[fgHeader] >= .5 ? lightGreen :
                                    rowInfo.row[fgHeader] >= 0 ? white :
                                        rowInfo.row[fgHeader] < 0 && rowInfo.row[fgHeader] > -1 ? lightRed :
                                            rowInfo.row[fgHeader] <= -1 && rowInfo.row[fgHeader] > -2 ? mediumRed :
                                                rowInfo.row[fgHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'FT%',
            accessor: ftHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ftHeader] > 2 ? brightGreen :
                            rowInfo.row[ftHeader] > 1 ? mediumGreen :
                                rowInfo.row[ftHeader] >= .5 ? lightGreen :
                                    rowInfo.row[ftHeader] >= 0 ? white :
                                        rowInfo.row[ftHeader] < 0 && rowInfo.row[ftHeader] > -1 ? lightRed :
                                            rowInfo.row[ftHeader] <= -1 && rowInfo.row[ftHeader] > -2 ? mediumRed :
                                                rowInfo.row[ftHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Turnovers',
            accessor: toHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[toHeader] > 2 ? brightGreen :
                            rowInfo.row[toHeader] > 1 ? mediumGreen :
                                rowInfo.row[toHeader] >= .5 ? lightGreen :
                                    rowInfo.row[toHeader] >= 0 ? white :
                                        rowInfo.row[toHeader] < 0 && rowInfo.row[toHeader] > -1 ? lightRed :
                                            rowInfo.row[toHeader] <= -1 && rowInfo.row[toHeader] > -2 ? mediumRed :
                                                rowInfo.row[toHeader] <= -2 ? brightRed : null,
                    },
                };
            },
        }];

        //column names for the average tables
        const columnNamesAvg = [{
            Header: '',
            accessor: 'name',
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: white
                    },
                };
            }
        }, {
            Header: 'Overall Value',
            accessor: ratingHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ratingHeader] > 1 ? brightGreen :
                            rowInfo.row[ratingHeader] > .5 ? mediumGreen :
                                rowInfo.row[ratingHeader] >= .25 ? lightGreen :
                                    rowInfo.row[ratingHeader] >= 0 ? white :
                                        rowInfo.row[ratingHeader] < 0 && rowInfo.row[ratingHeader] > -0.25 ? lightRed :
                                            rowInfo.row[ratingHeader] < -0.25 && rowInfo.row[ratingHeader] > -1 ? mediumRed :
                                                rowInfo.row[ratingHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Points',
            accessor: ptsHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ptsHeader] > 1 ? brightGreen :
                            rowInfo.row[ptsHeader] > .5 ? mediumGreen :
                                rowInfo.row[ptsHeader] >= .25 ? lightGreen :
                                    rowInfo.row[ptsHeader] >= 0 ? white :
                                        rowInfo.row[ptsHeader] < 0 && rowInfo.row[ptsHeader] > -0.25 ? lightRed :
                                            rowInfo.row[ptsHeader] < -0.25 && rowInfo.row[ptsHeader] > -1 ? mediumRed :
                                                rowInfo.row[ptsHeader] <= -1 ? brightRed : null,
                    },
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
                        backgroundColor: rowInfo && rowInfo.row[threesHeader] > 1 ? brightGreen :
                            rowInfo.row[threesHeader] > .5 ? mediumGreen :
                                rowInfo.row[threesHeader] >= .25 ? lightGreen :
                                    rowInfo.row[threesHeader] >= 0 ? white :
                                        rowInfo.row[threesHeader] < 0 && rowInfo.row[threesHeader] > -0.25 ? lightRed :
                                            rowInfo.row[threesHeader] < -0.25 && rowInfo.row[threesHeader] > -1 ? mediumRed :
                                                rowInfo.row[threesHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Rebounds',
            accessor: rebHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[rebHeader] > 1 ? brightGreen :
                            rowInfo.row[rebHeader] > .5 ? mediumGreen :
                                rowInfo.row[rebHeader] >= .25 ? lightGreen :
                                    rowInfo.row[rebHeader] >= 0 ? white :
                                        rowInfo.row[rebHeader] < 0 && rowInfo.row[rebHeader] > -0.25 ? lightRed :
                                            rowInfo.row[rebHeader] < -0.25 && rowInfo.row[rebHeader] > -1 ? mediumRed :
                                                rowInfo.row[rebHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Assists',
            accessor: astHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[astHeader] > 1 ? brightGreen :
                            rowInfo.row[astHeader] > .5 ? mediumGreen :
                                rowInfo.row[astHeader] >= .25 ? lightGreen :
                                    rowInfo.row[astHeader] >= 0 ? white :
                                        rowInfo.row[astHeader] < 0 && rowInfo.row[astHeader] > -0.25 ? lightRed :
                                            rowInfo.row[astHeader] < -0.25 && rowInfo.row[astHeader] > -1 ? mediumRed :
                                                rowInfo.row[astHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Steals',
            accessor: stlHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[stlHeader] > 1 ? brightGreen :
                            rowInfo.row[stlHeader] > .5 ? mediumGreen :
                                rowInfo.row[stlHeader] >= .25 ? lightGreen :
                                    rowInfo.row[stlHeader] >= 0 ? white :
                                        rowInfo.row[stlHeader] < 0 && rowInfo.row[stlHeader] > -0.25 ? lightRed :
                                            rowInfo.row[stlHeader] < -0.25 && rowInfo.row[stlHeader] > -1 ? mediumRed :
                                                rowInfo.row[stlHeader] <= -1 ? brightRed : null,
                    },
                };
            },
        }, {
            Header: 'Blocks',
            accessor: blkHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[blkHeader] > 1 ? brightGreen :
                            rowInfo.row[blkHeader] > .5 ? mediumGreen :
                                rowInfo.row[blkHeader] >= .25 ? lightGreen :
                                    rowInfo.row[blkHeader] >= 0 ? white :
                                        rowInfo.row[blkHeader] < 0 && rowInfo.row[blkHeader] > -0.25 ? lightRed :
                                            rowInfo.row[blkHeader] < -0.25 && rowInfo.row[blkHeader] > -1 ? mediumRed :
                                                rowInfo.row[blkHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'FG%',
            accessor: fgHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[fgHeader] > 1 ? brightGreen :
                            rowInfo.row[fgHeader] > .5 ? mediumGreen :
                                rowInfo.row[fgHeader] >= .25 ? lightGreen :
                                    rowInfo.row[fgHeader] >= 0 ? white :
                                        rowInfo.row[fgHeader] < 0 && rowInfo.row[fgHeader] > -0.25 ? lightRed :
                                            rowInfo.row[fgHeader] < -0.25 && rowInfo.row[fgHeader] > -1 ? mediumRed :
                                                rowInfo.row[fgHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'FT%',
            accessor: ftHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[ftHeader] > 1 ? brightGreen :
                            rowInfo.row[ftHeader] > .5 ? mediumGreen :
                                rowInfo.row[ftHeader] >= .25 ? lightGreen :
                                    rowInfo.row[ftHeader] >= 0 ? white :
                                        rowInfo.row[ftHeader] < 0 && rowInfo.row[ftHeader] > -0.25 ? lightRed :
                                            rowInfo.row[ftHeader] < -0.25 && rowInfo.row[ftHeader] > -1 ? mediumRed :
                                                rowInfo.row[ftHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }, {
            Header: 'Turnovers',
            accessor: toHeader,
            minWidth: 60,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: rowInfo && rowInfo.row[toHeader] > 1 ? brightGreen :
                            rowInfo.row[toHeader] > .5 ? mediumGreen :
                                rowInfo.row[toHeader] >= .25 ? lightGreen :
                                    rowInfo.row[toHeader] >= 0 ? white :
                                        rowInfo.row[toHeader] < 0 && rowInfo.row[toHeader] > -0.25 ? lightRed :
                                            rowInfo.row[toHeader] < -0.25 && rowInfo.row[toHeader] > -1 ? mediumRed :
                                                rowInfo.row[toHeader] <= -1 ? brightRed : null,
                    }
                };
            }
        }];

        //Update the switch stats button text on state change
        var showStatsText;
        var showRecentText;
        if (!this.state.showBBMStats) {
            showStatsText = 'Use BasketballMonster Rankings';
        } else {
            showStatsText = 'Use FantasyBasketball.io Rankings';
        }

        var teamTradeStatsSeason;
        var oppTeamTradeStatsSeason;
        var teamTradeImprovement;
        var teamStatsSeason;
        var teamStatsSeasonAvg;
        var compareStatsSeason;
        if (!this.state.showRecentStats) {
            showRecentText = 'Use Recent Rankings';
            teamTradeStatsSeason = this.state.teamTradeStatsSeason;
            oppTeamTradeStatsSeason = this.state.oppTeamTradeStatsSeason;
            teamTradeImprovement = this.state.teamTradeImprovement;
            teamStatsSeason = this.state.teamStatsSeason;
            teamStatsSeasonAvg = this.state.teamStatsSeasonAvg;
            compareStatsSeason = this.state.compareStatsSeason;
        } else {
            showRecentText = 'Use Season Rankings';
            teamTradeStatsSeason = this.state.teamTradeStatsSeason;
            oppTeamTradeStatsSeason = this.state.oppTeamTradeStatsSeason;
            teamTradeImprovement = this.state.teamTradeImprovement;
            teamStatsSeason = this.state.teamStatsRecent;
            teamStatsSeasonAvg = this.state.teamStatsRecentAvg;
            compareStatsSeason = this.state.compareStatsRecent;
        }

        var paid = Cookies.get('paid');
        var tradeHTML;
        if (paid === "true") {
            tradeHTML = <div className="table-container flex-vertical">
                <div className="table-info-container flex-vertical">
                    <div className="table-info-headers flex">
                        <div className="table-info-header" onClick={this.changeBBMStats}>{showStatsText}</div>
                        <div className="table-info-header" onClick={this.changeRecentStats}>{showRecentText}</div>
                    </div>
                    <div className="table-info-tables">
                        <div className="table-group">
                            <h3 className="team-table-header trade-table-header">Trading Away</h3>
                            <ReactTable
                                data={teamTradeStatsSeason}
                                columns={columnNames}
                                showPagination={false}
                                minRows={0}
                                className="-highlight"
                                defaultSortDesc={true}
                                defaultSorted={[{
                                    id: 'overallRank',
                                    desc: false
                                }]}
                                getTrProps={(state, rowInfo) => {
                                    if (rowInfo && rowInfo.row) {
                                        return {
                                            onClick: (e) => {
                                                var selected = this.state.selected;
                                                selected.splice(selected.indexOf(rowInfo.original.playerName), 1);
                                                this.setState({ selected: selected });
                                                localStorage.setItem('selected', JSON.stringify(selected));
                                                this.removeFromTeamTrade(rowInfo);
                                            }
                                        }
                                    } else {
                                        return {}
                                    }
                                }}

                            />

                            <h3 className="team-table-header trade-table-header">Getting Back</h3>
                            <ReactTable
                                data={oppTeamTradeStatsSeason}
                                columns={columnNames}
                                showPagination={false}
                                minRows={0}
                                className="-highlight"
                                defaultSortDesc={true}
                                defaultSorted={[{
                                    id: 'overallRank',
                                    desc: false
                                }]}
                                getTrProps={(state, rowInfo) => {
                                    if (rowInfo && rowInfo.row) {
                                        return {
                                            onClick: (e) => {
                                                var selectedOpp = this.state.selectedOpp;
                                                selectedOpp.splice(selectedOpp.indexOf(rowInfo.original.playerName), 1);
                                                this.setState({ selectedOpp: selectedOpp });
                                                localStorage.setItem('selectedOpp', JSON.stringify(selectedOpp));
                                                this.removeFromOppTeamTrade(rowInfo);
                                            }
                                        }
                                    } else {
                                        return {}
                                    }
                                }}

                            />

                            <h3 className="team-table-header trade-table-header">Improvement</h3>
                            <ReactTable
                                data={teamTradeImprovement}
                                columns={columnNamesAvg}
                                showPagination={false}
                                className="-highlight"
                                minRows={0}

                            />

                            <div className="team-table">
                                <ReactTable
                                    key="teamTable"
                                    data={teamStatsSeason}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    defaultSortDesc={true}
                                    className="-highlight"
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}
                                    getTrProps={(state, rowInfo) => {
                                        if (rowInfo && rowInfo.row) {
                                            return {
                                                onClick: (e) => {
                                                    if (this.state.selected.indexOf(rowInfo.original.playerName) >= 0) {
                                                        var selected = this.state.selected;
                                                        selected.splice(selected.indexOf(rowInfo.original.playerName), 1);
                                                        this.setState({ selected: selected });
                                                        localStorage.setItem('selected', JSON.stringify(selected));
                                                        this.removeFromTeamTrade(rowInfo);
                                                    } else {
                                                        var selected = this.state.selected;
                                                        selected.push(rowInfo.original.playerName);
                                                        this.setState({ selected: selected });
                                                        localStorage.setItem('selected', JSON.stringify(selected));
                                                        this.addToTeamTrade(rowInfo);
                                                    }

                                                },
                                                className: this.state.selected.indexOf(rowInfo.original.playerName) >= 0 ? 'selected' : '',
                                                style: {
                                                }
                                            }
                                        } else {
                                            return {}
                                        }
                                    }}

                                />
                            </div>

                            <div className={`team-table`}>

                                <h3 className="team-table-header compare-header">Trading Partner</h3>
                                <div className="flex">
                                    <div className="team-select">
                                        <Select
                                            value={teamSelected}
                                            onChange={this.handleTeamChange}
                                            options={teamSelect}
                                            className='react-select-container'
                                            classNamePrefix='react-select'
                                        />
                                    </div>
                                    <div className={`hide-button team-select ${this.state.showCompareTable ? '' : 'hide'}`} onClick={this.hideCompareTable}>
                                        Hide Comparison
                                </div>
                                </div>
                                <div className={`team-table ${this.state.showCompareTable ? '' : 'hide'}`}>
                                    <div className="team-table">
                                        <ReactTable
                                            key="compareTable"
                                            data={compareStatsSeason}
                                            columns={columnNames}
                                            showPagination={false}
                                            minRows={0}
                                            defaultSortDesc={true}
                                            className="-highlight"
                                            defaultSorted={[{
                                                id: 'overallRank',
                                                desc: false
                                            }]}
                                            // SubComponent={row => {
                                            //     return (
                                            //         <ReactTable
                                            //             data={[row.original]}
                                            //             columns={expandedColumnNames}
                                            //             showPagination={false}
                                            //             defaultPageSize={1}
                                            //             className="expandedRow"
                                            //         />
                                            //     );
                                            // }}
                                            getTrProps={(state, rowInfo) => {
                                                if (rowInfo && rowInfo.row) {
                                                    return {
                                                        onClick: (e) => {
                                                            if (this.state.selectedOpp.indexOf(rowInfo.original.playerName) >= 0) {
                                                                var selectedOpp = this.state.selectedOpp;
                                                                selectedOpp.splice(selectedOpp.indexOf(rowInfo.original.playerName), 1);
                                                                this.setState({ selectedOpp: selectedOpp });
                                                                localStorage.setItem('selectedOpp', JSON.stringify(selectedOpp));
                                                                this.removeFromOppTeamTrade(rowInfo);
                                                            } else {
                                                                var selectedOpp = this.state.selectedOpp;
                                                                selectedOpp.push(rowInfo.original.playerName);
                                                                this.setState({ selectedOpp: selectedOpp });
                                                                localStorage.setItem('selectedOpp', JSON.stringify(selectedOpp));
                                                                this.addToOppTeamTrade(rowInfo);
                                                            }
                                                        },
                                                        className: this.state.selectedOpp.indexOf(rowInfo.original.playerName) >= 0 ? 'selected' : '',
                                                        style: {
                                                            // background: this.state.selectedOpp.indexOf(rowInfo.original._id) >= 0 ? '#00afec' : 'white',
                                                            // color: this.state.selectedOpp.indexOf(rowInfo.original._id) >= 0 ? 'white' : 'black'
                                                        }
                                                    }
                                                } else {
                                                    return {}
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            tradeHTML = 
                <div className="table-container flex-vertical">
                <div className="trade-premium"><TradeModal />
                    <div className="table-info-container flex-vertical">
                        <div className="table-info-headers flex">
                            <div className="table-info-header" onClick={this.changeBBMStats}>{showStatsText}</div>
                            <div className="table-info-header" onClick={this.changeRecentStats}>{showRecentText}</div>
                        </div>
                        <div className="table-info-tables">
                            <div className="table-group">
                                <h3 className="team-table-header trade-table-header">Trading Away</h3>
                                <ReactTable
                                    data={teamTradeStatsSeason}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    className="-highlight"
                                    defaultSortDesc={true}
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}

                                />

                                <h3 className="team-table-header trade-table-header">Getting Back</h3>
                                <ReactTable
                                    data={oppTeamTradeStatsSeason}
                                    columns={columnNames}
                                    showPagination={false}
                                    minRows={0}
                                    className="-highlight"
                                    defaultSortDesc={true}
                                    defaultSorted={[{
                                        id: 'overallRank',
                                        desc: false
                                    }]}

                                />

                                <h3 className="team-table-header trade-table-header">Improvement</h3>
                                <ReactTable
                                    data={teamTradeImprovement}
                                    columns={columnNamesAvg}
                                    showPagination={false}
                                    className="-highlight"
                                    minRows={0}

                                />

                                <div className="team-table">
                                    <ReactTable
                                        key="teamTable"
                                        data={teamStatsSeason}
                                        columns={columnNames}
                                        showPagination={false}
                                        minRows={0}
                                        defaultSortDesc={true}
                                        className="-highlight"
                                        defaultSorted={[{
                                            id: 'overallRank',
                                            desc: false
                                        }]}
                                    />
                                </div>

                                <div className={`team-table`}>

                                    <h3 className="team-table-header compare-header">Trading Partner</h3>
                                    <div className="flex">
                                        <div className="team-select">
                                            <Select
                                                value={teamSelected}
                                                onChange={this.handleTeamChange}
                                                options={teamSelect}
                                                className='react-select-container'
                                                classNamePrefix='react-select'
                                            />
                                        </div>
                                        <div className={`hide-button team-select ${this.state.showCompareTable ? '' : 'hide'}`} onClick={this.hideCompareTable}>
                                            Hide Comparison
                                </div>
                                    </div>
                                    <div className={`team-table ${this.state.showCompareTable ? '' : 'hide'}`}>
                                        <div className="team-table">
                                            <ReactTable
                                                key="compareTable"
                                                data={compareStatsSeason}
                                                columns={columnNames}
                                                showPagination={false}
                                                minRows={0}
                                                defaultSortDesc={true}
                                                className="-highlight"
                                                defaultSorted={[{
                                                    id: 'overallRank',
                                                    desc: false
                                                }]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        return (
            tradeHTML
        )
    }
}

export default TradeAnalysis;