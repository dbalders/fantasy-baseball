import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Cookies from 'js-cookie';
import Select from 'react-select';
import stringSimilarity from 'string-similarity';
import { callApi } from './CallApi';
import { TradeModal } from './TradeModal'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-135378238-2');
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
        var playersSelected = false;

        var recentAvg = JSON.parse(localStorage.getItem('teamStatsRecentAvg'));
        this.setState({
            teamStatsSeasonOrig: seasonAvg,
            teamStatsRecentOrig: recentAvg
        })

        var teamTradeStatsSeason = JSON.parse(localStorage.getItem('teamTradeStatsSeason'));
        var oppTeamTradeStatsSeason = JSON.parse(localStorage.getItem('oppTeamTradeStatsSeason'));

        if (teamTradeStatsSeason === null) {
            teamTradeStatsSeason = []
        }
        if (oppTeamTradeStatsSeason === null) {
            oppTeamTradeStatsSeason = []
        }

        if ((teamTradeStatsSeason.length > 0) || (oppTeamTradeStatsSeason.length > 0)) {
            var selected = JSON.parse(localStorage.getItem('selected'));
            var selectedOpp = JSON.parse(localStorage.getItem('selectedOpp'));
            var overallRating = 0;
            var avgRating = 0;
            var runRating = 0;
            var rbiRating = 0;
            var homeRunRating = 0;
            var sbRating = 0;
            var obpRating = 0;
            var slgRating = 0;
            var doubleRating = 0;
            var walkRating = 0;
            var opsRating = 0;
            var winRating = 0;
            var eraRating = 0;
            var whipRating = 0;
            var ipRating = 0;
            var svRating = 0;
            var kRating = 0;
            var holdRating = 0;
            var saveholdRating = 0;
            var k9Rating = 0;       
            
            if (selected === null) {
                selected = []
            }
            if (selectedOpp === null) {
                selectedOpp = []
            }

            this.setState({
                teamTradeStatsSeason: teamTradeStatsSeason,
                oppTeamTradeStatsSeason: oppTeamTradeStatsSeason,
                selected: selected,
                selectedOpp: selectedOpp
            })

            for (var i = 0; i < teamTradeStatsSeason.length; i++) {
                overallRating = Number(parseFloat(overallRating) - parseFloat(teamTradeStatsSeason[i].overallRating)).toFixed(2);
                avgRating = Number(parseFloat(avgRating) - parseFloat(teamTradeStatsSeason[i].avgRating)).toFixed(2);
                runRating = Number(parseFloat(runRating) - parseFloat(teamTradeStatsSeason[i].runRating)).toFixed(2);
                rbiRating = Number(parseFloat(rbiRating) - parseFloat(teamTradeStatsSeason[i].rbiRating)).toFixed(2);
                homeRunRating = Number(parseFloat(homeRunRating) - parseFloat(teamTradeStatsSeason[i].homeRunRating)).toFixed(2);
                sbRating = Number(parseFloat(sbRating) - parseFloat(teamTradeStatsSeason[i].sbRating)).toFixed(2);
                obpRating = Number(parseFloat(obpRating) - parseFloat(teamTradeStatsSeason[i].obpRating)).toFixed(2);
                slgRating = Number(parseFloat(slgRating) - parseFloat(teamTradeStatsSeason[i].slgRating)).toFixed(2);
                doubleRating = Number(parseFloat(doubleRating) - parseFloat(teamTradeStatsSeason[i].doubleRating)).toFixed(2);
                walkRating = Number(parseFloat(walkRating) - parseFloat(teamTradeStatsSeason[i].walkRating)).toFixed(2);
                opsRating = Number(parseFloat(opsRating) - parseFloat(teamTradeStatsSeason[i].opsRating)).toFixed(2);
                winRating = Number(parseFloat(winRating) - parseFloat(teamTradeStatsSeason[i].winRating)).toFixed(2);
                eraRating = Number(parseFloat(eraRating) - parseFloat(teamTradeStatsSeason[i].eraRating)).toFixed(2);
                whipRating = Number(parseFloat(whipRating) - parseFloat(teamTradeStatsSeason[i].whipRating)).toFixed(2);
                ipRating = Number(parseFloat(ipRating) - parseFloat(teamTradeStatsSeason[i].ipRating)).toFixed(2);
                svRating = Number(parseFloat(svRating) - parseFloat(teamTradeStatsSeason[i].svRating)).toFixed(2);
                kRating = Number(parseFloat(kRating) - parseFloat(teamTradeStatsSeason[i].kRating)).toFixed(2);
                holdRating = Number(parseFloat(holdRating) - parseFloat(teamTradeStatsSeason[i].holdRating)).toFixed(2);
                saveholdRating = Number(parseFloat(saveholdRating) - parseFloat(teamTradeStatsSeason[i].saveholdRating)).toFixed(2);
                k9Rating = Number(parseFloat(k9Rating) - parseFloat(teamTradeStatsSeason[i].k9Rating)).toFixed(2);
            }

            for (i = 0; i < oppTeamTradeStatsSeason.length; i++) {
                overallRating = Number(parseFloat(overallRating) + parseFloat(oppTeamTradeStatsSeason[i].overallRating)).toFixed(2);
                avgRating = Number(parseFloat(avgRating) + parseFloat(oppTeamTradeStatsSeason[i].avgRating)).toFixed(2);
                runRating = Number(parseFloat(runRating) + parseFloat(oppTeamTradeStatsSeason[i].runRating)).toFixed(2);
                rbiRating = Number(parseFloat(rbiRating) + parseFloat(oppTeamTradeStatsSeason[i].rbiRating)).toFixed(2);
                homeRunRating = Number(parseFloat(homeRunRating) + parseFloat(oppTeamTradeStatsSeason[i].homeRunRating)).toFixed(2);
                sbRating = Number(parseFloat(sbRating) + parseFloat(oppTeamTradeStatsSeason[i].sbRating)).toFixed(2);
                obpRating = Number(parseFloat(obpRating) + parseFloat(oppTeamTradeStatsSeason[i].obpRating)).toFixed(2);
                slgRating = Number(parseFloat(slgRating) + parseFloat(oppTeamTradeStatsSeason[i].slgRating)).toFixed(2);
                doubleRating = Number(parseFloat(doubleRating) + parseFloat(oppTeamTradeStatsSeason[i].doubleRating)).toFixed(2);
                walkRating = Number(parseFloat(walkRating) + parseFloat(oppTeamTradeStatsSeason[i].walkRating)).toFixed(2);
                opsRating = Number(parseFloat(opsRating) + parseFloat(oppTeamTradeStatsSeason[i].opsRating)).toFixed(2);
                winRating = Number(parseFloat(winRating) + parseFloat(oppTeamTradeStatsSeason[i].winRating)).toFixed(2);
                eraRating = Number(parseFloat(eraRating) + parseFloat(oppTeamTradeStatsSeason[i].eraRating)).toFixed(2);
                whipRating = Number(parseFloat(whipRating) + parseFloat(oppTeamTradeStatsSeason[i].whipRating)).toFixed(2);
                ipRating = Number(parseFloat(ipRating) + parseFloat(oppTeamTradeStatsSeason[i].ipRating)).toFixed(2);
                svRating = Number(parseFloat(svRating) + parseFloat(oppTeamTradeStatsSeason[i].svRating)).toFixed(2);
                kRating = Number(parseFloat(kRating) + parseFloat(oppTeamTradeStatsSeason[i].kRating)).toFixed(2);
                holdRating = Number(parseFloat(holdRating) + parseFloat(oppTeamTradeStatsSeason[i].holdRating)).toFixed(2);
                saveholdRating = Number(parseFloat(saveholdRating) + parseFloat(oppTeamTradeStatsSeason[i].saveholdRating)).toFixed(2);
                k9Rating = Number(parseFloat(k9Rating) + parseFloat(oppTeamTradeStatsSeason[i].k9Rating)).toFixed(2);
            }

            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: overallRating,
                avgRating: avgRating,
                runRating: runRating,
                rbiRating: rbiRating,
                homeRunRating: homeRunRating,
                sbRating: sbRating,
                obpRating: obpRating,
                slgRating: slgRating,
                doubleRating: doubleRating,
                walkRating: walkRating,
                opsRating: opsRating,
                winRating: winRating,
                eraRating: eraRating,
                whipRating: whipRating,
                ipRating: ipRating,
                svRating: svRating,
                kRating: kRating,
                holdRating: holdRating,
                saveholdRating: saveholdRating,
                k9Rating: k9Rating
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                avgRating: seasonAvg[0].avgRating,
                runRating: seasonAvg[0].runRating,
                rbiRating: seasonAvg[0].rbiRating,
                homeRunRating: seasonAvg[0].homeRunRating,
                sbRating: seasonAvg[0].sbRating,
                obpRating: seasonAvg[0].obpRating,
                slgRating: seasonAvg[0].slgRating,
                doubleRating: seasonAvg[0].doubleRating,
                walkRating: seasonAvg[0].walkRating,
                opsRating: seasonAvg[0].opsRating,
                winRating: seasonAvg[0].winRating,
                eraRating: seasonAvg[0].eraRating,
                whipRating: seasonAvg[0].whipRating,
                ipRating: seasonAvg[0].ipRating,
                svRating: seasonAvg[0].svRating,
                kRating: seasonAvg[0].kRating,
                holdRating: seasonAvg[0].holdRating,
                saveholdRating: seasonAvg[0].saveholdRating,
                k9Rating: seasonAvg[0].k9Rating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(seasonAvg[0].overallRating) + parseFloat(overallRating)).toFixed(2),
                avgRating: Number(parseFloat(seasonAvg[0].avgRating) + parseFloat(avgRating)).toFixed(2),
                runRating: Number(parseFloat(seasonAvg[0].runRating) + parseFloat(runRating)).toFixed(2),
                rbiRating: Number(parseFloat(seasonAvg[0].rbiRating) + parseFloat(rbiRating)).toFixed(2),
                homeRunRating: Number(parseFloat(seasonAvg[0].homeRunRating) + parseFloat(homeRunRating)).toFixed(2),
                sbRating: Number(parseFloat(seasonAvg[0].sbRating) + parseFloat(sbRating)).toFixed(2),
                obpRating: Number(parseFloat(seasonAvg[0].obpRating) + parseFloat(obpRating)).toFixed(2),
                slgRating: Number(parseFloat(seasonAvg[0].slgRating) + parseFloat(slgRating)).toFixed(2),
                doubleRating: Number(parseFloat(seasonAvg[0].doubleRating) + parseFloat(doubleRating)).toFixed(2),
                walkRating: Number(parseFloat(seasonAvg[0].walkRating) + parseFloat(walkRating)).toFixed(2),
                opsRating: Number(parseFloat(seasonAvg[0].opsRating) + parseFloat(opsRating)).toFixed(2),
                winRating: Number(parseFloat(seasonAvg[0].winRating) + parseFloat(winRating)).toFixed(2),
                eraRating: Number(parseFloat(seasonAvg[0].eraRating) + parseFloat(eraRating)).toFixed(2),
                whipRating: Number(parseFloat(seasonAvg[0].whipRating) + parseFloat(whipRating)).toFixed(2),
                ipRating: Number(parseFloat(seasonAvg[0].ipRating) + parseFloat(ipRating)).toFixed(2),
                svRating: Number(parseFloat(seasonAvg[0].svRating) + parseFloat(svRating)).toFixed(2),
                kRating: Number(parseFloat(seasonAvg[0].kRating) + parseFloat(kRating)).toFixed(2),
                holdRating: Number(parseFloat(seasonAvg[0].holdRating) + parseFloat(holdRating)).toFixed(2),
                saveholdRating: Number(parseFloat(seasonAvg[0].saveholdRating) + parseFloat(saveholdRating)).toFixed(2),
                k9Rating: Number(parseFloat(seasonAvg[0].k9Rating) + parseFloat(k9Rating)).toFixed(2)
            });

        } else {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: 0,
                avgRating: 0,
                runRating: 0,
                rbiRating: 0,
                homeRunRating: 0,
                sbRating: 0,
                obpRating: 0,
                slgRating: 0,
                doubleRating: 0,
                walkRating: 0,
                opsRating: 0,
                winRating: 0,
                eraRating: 0,
                whipRating: 0,
                ipRating: 0,
                svRating: 0,
                kRating: 0,
                holdRating: 0,
                saveholdRating: 0,
                k9Rating: 0
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                avgRating: seasonAvg[0].avgRating,
                runRating: seasonAvg[0].runRating,
                rbiRating: seasonAvg[0].rbiRating,
                homeRunRating: seasonAvg[0].homeRunRating,
                sbRating: seasonAvg[0].sbRating,
                obpRating: seasonAvg[0].obpRating,
                slgRating: seasonAvg[0].slgRating,
                doubleRating: seasonAvg[0].doubleRating,
                walkRating: seasonAvg[0].walkRating,
                opsRating: seasonAvg[0].opsRating,
                winRating: seasonAvg[0].winRating,
                eraRating: seasonAvg[0].eraRating,
                whipRating: seasonAvg[0].whipRating,
                ipRating: seasonAvg[0].ipRating,
                svRating: seasonAvg[0].svRating,
                kRating: seasonAvg[0].kRating,
                holdRating: seasonAvg[0].holdRating,
                saveholdRating: seasonAvg[0].saveholdRating,
                k9Rating: seasonAvg[0].k9Rating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: seasonAvg[0].overallRating,
                avgRating: seasonAvg[0].avgRating,
                runRating: seasonAvg[0].runRating,
                rbiRating: seasonAvg[0].rbiRating,
                homeRunRating: seasonAvg[0].homeRunRating,
                sbRating: seasonAvg[0].sbRating,
                obpRating: seasonAvg[0].obpRating,
                slgRating: seasonAvg[0].slgRating,
                doubleRating: seasonAvg[0].doubleRating,
                walkRating: seasonAvg[0].walkRating,
                opsRating: seasonAvg[0].opsRating,
                winRating: seasonAvg[0].winRating,
                eraRating: seasonAvg[0].eraRating,
                whipRating: seasonAvg[0].whipRating,
                ipRating: seasonAvg[0].ipRating,
                svRating: seasonAvg[0].svRating,
                kRating: seasonAvg[0].kRating,
                holdRating: seasonAvg[0].holdRating,
                saveholdRating: seasonAvg[0].saveholdRating,
                k9Rating: seasonAvg[0].k9Rating
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
        var batterLength = 0;
        var pitcherLength = 0;

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

                    if (playerRankingsSeason[j].playerType === "Batter") {
                        batterLength++;
                    } else {
                        pitcherLength++;
                    }

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

                    //Start calculating averages by adding them all up
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
                        k9Rating: (teamStatsSeasonAvg.k9Rating) ? (teamStatsSeasonAvg.k9Rating + k9Rating) : k9Rating
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
                        k9Rating: (teamStatsRecentAvg.k9Rating) ? (teamStatsRecentAvg.k9Rating + k9Rating) : k9Rating
                    }
                    break
                }
            }
        }

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
            k9Rating: Number(teamStatsSeasonAvg.k9Rating / pitcherLength).toFixed(2)
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
            k9Rating: Number(teamStatsRecentAvg.k9Rating / pitcherLength).toFixed(2)
        }

        var teamTradeImprovement = [];

        if ((this.state.teamTradeStatsSeason.length === 0) && (this.state.oppTeamTradeStatsSeason.length === 0)) {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: 0,
                avgRating: 0,
                runRating: 0,
                rbiRating: 0,
                homeRunRating: 0,
                sbRating: 0,
                obpRating: 0,
                slgRating: 0,
                doubleRating: 0,
                walkRating: 0,
                opsRating: 0,
                winRating: 0,
                eraRating: 0,
                whipRating: 0,
                ipRating: 0,
                svRating: 0,
                kRating: 0,
                holdRating: 0,
                saveholdRating: 0,
                k9Rating: 0
            });
        } else {
            var overallRating = 0;
            var avgRating = 0;
            var runRating = 0;
            var rbiRating = 0;
            var homeRunRating = 0;
            var sbRating = 0;
            var obpRating = 0;
            var slgRating = 0;
            var doubleRating = 0;
            var walkRating = 0;
            var opsRating = 0;
            var winRating = 0;
            var eraRating = 0;
            var whipRating = 0;
            var ipRating = 0;
            var svRating = 0;
            var kRating = 0;
            var holdRating = 0;
            var saveholdRating = 0;
            var k9Rating = 0;

            for (i = 0; i < this.state.teamTradeStatsSeason.length; i++) {
                overallRating = Number(overallRating - this.state.teamTradeStatsSeason[i].overallRating).toFixed(2);
                avgRating = Number(avgRating - this.state.teamTradeStatsSeason[i].avgRating).toFixed(2);
                runRating = Number(runRating - this.state.teamTradeStatsSeason[i].runRating).toFixed(2);
                rbiRating = Number(rbiRating - this.state.teamTradeStatsSeason[i].rbiRating).toFixed(2);
                homeRunRating = Number(homeRunRating - this.state.teamTradeStatsSeason[i].homeRunRating).toFixed(2);
                sbRating = Number(sbRating - this.state.teamTradeStatsSeason[i].sbRating).toFixed(2);
                obpRating = Number(obpRating - this.state.teamTradeStatsSeason[i].obpRating).toFixed(2);
                slgRating = Number(slgRating - this.state.teamTradeStatsSeason[i].slgRating).toFixed(2);
                doubleRating = Number(doubleRating - this.state.teamTradeStatsSeason[i].doubleRating).toFixed(2);
                walkRating = Number(walkRating - this.state.teamTradeStatsSeason[i].walkRating).toFixed(2);
                opsRating = Number(opsRating - this.state.teamTradeStatsSeason[i].opsRating).toFixed(2);
                winRating = Number(winRating - this.state.teamTradeStatsSeason[i].winRating).toFixed(2);
                eraRating = Number(eraRating - this.state.teamTradeStatsSeason[i].eraRating).toFixed(2);
                whipRating = Number(whipRating - this.state.teamTradeStatsSeason[i].whipRating).toFixed(2);
                ipRating = Number(ipRating - this.state.teamTradeStatsSeason[i].ipRating).toFixed(2);
                svRating = Number(svRating - this.state.teamTradeStatsSeason[i].svRating).toFixed(2);
                kRating = Number(kRating - this.state.teamTradeStatsSeason[i].kRating).toFixed(2);
                holdRating = Number(holdRating - this.state.teamTradeStatsSeason[i].holdRating).toFixed(2);
                saveholdRating = Number(saveholdRating - this.state.teamTradeStatsSeason[i].saveholdRating).toFixed(2);
                k9Rating = Number(k9Rating - this.state.teamTradeStatsSeason[i].k9Rating).toFixed(2);
            }

            for (j = 0; j < this.state.oppTeamTradeStatsSeason.length; j++) {
                overallRating = Number(parseFloat(overallRating) + this.state.oppTeamTradeStatsSeason[j].overallRating).toFixed(2);
                avgRating = Number(parseFloat(avgRating) + this.state.oppTeamTradeStatsSeason[j].avgRating).toFixed(2);
                runRating = Number(parseFloat(runRating) + this.state.oppTeamTradeStatsSeason[j].runRating).toFixed(2);
                rbiRating = Number(parseFloat(rbiRating) + this.state.oppTeamTradeStatsSeason[j].rbiRating).toFixed(2);
                homeRunRating = Number(parseFloat(homeRunRating) + this.state.oppTeamTradeStatsSeason[j].homeRunRating).toFixed(2);
                sbRating = Number(parseFloat(sbRating) + this.state.oppTeamTradeStatsSeason[j].sbRating).toFixed(2);
                obpRating = Number(parseFloat(obpRating) + this.state.oppTeamTradeStatsSeason[j].obpRating).toFixed(2);
                slgRating = Number(parseFloat(slgRating) + this.state.oppTeamTradeStatsSeason[j].slgRating).toFixed(2);
                doubleRating = Number(parseFloat(doubleRating) + this.state.oppTeamTradeStatsSeason[j].doubleRating).toFixed(2);
                walkRating = Number(parseFloat(walkRating) + this.state.oppTeamTradeStatsSeason[j].walkRating).toFixed(2);
                opsRating = Number(parseFloat(opsRating) + this.state.oppTeamTradeStatsSeason[j].opsRating).toFixed(2);
                winRating = Number(parseFloat(winRating) + this.state.oppTeamTradeStatsSeason[j].winRating).toFixed(2);
                eraRating = Number(parseFloat(eraRating) + this.state.oppTeamTradeStatsSeason[j].eraRating).toFixed(2);
                whipRating = Number(parseFloat(whipRating) + this.state.oppTeamTradeStatsSeason[j].whipRating).toFixed(2);
                ipRating = Number(parseFloat(ipRating) + this.state.oppTeamTradeStatsSeason[j].ipRating).toFixed(2);
                svRating = Number(parseFloat(svRating) + this.state.oppTeamTradeStatsSeason[j].svRating).toFixed(2);
                kRating = Number(parseFloat(kRating) + this.state.oppTeamTradeStatsSeason[j].kRating).toFixed(2);
                holdRating = Number(parseFloat(holdRating) + this.state.oppTeamTradeStatsSeason[j].holdRating).toFixed(2);
                saveholdRating = Number(parseFloat(saveholdRating) + this.state.oppTeamTradeStatsSeason[j].saveholdRating).toFixed(2);
                k9Rating = Number(parseFloat(k9Rating) + this.state.oppTeamTradeStatsSeason[j].k9Rating).toFixed(2);
            }
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: overallRating,
                avgRating: avgRating,
                runRating: runRating,
                rbiRating: rbiRating,
                homeRunRating: homeRunRating,
                sbRating: sbRating,
                obpRating: obpRating,
                slgRating: slgRating,
                doubleRating: doubleRating,
                walkRating: walkRating,
                opsRating: opsRating,
                winRating: winRating,
                eraRating: eraRating,
                whipRating: whipRating,
                ipRating: ipRating,
                svRating: svRating,
                kRating: kRating,
                holdRating: holdRating,
                saveholdRating: saveholdRating,
                k9Rating: k9Rating
            });
        }


        teamTradeImprovement.push({
            name: 'Current team',
            overallRating: teamStatsSeasonAvg.overallRating,
            avgRating: teamStatsSeasonAvg.avgRating,
            runRating: teamStatsSeasonAvg.runRating,
            rbiRating: teamStatsSeasonAvg.rbiRating,
            homeRunRating: teamStatsSeasonAvg.homeRunRating,
            sbRating: teamStatsSeasonAvg.sbRating,
            obpRating: teamStatsSeasonAvg.obpRating,
            slgRating: teamStatsSeasonAvg.slgRating,
            doubleRating: teamStatsSeasonAvg.doubleRating,
            walkRating: teamStatsSeasonAvg.walkRating,
            opsRating: teamStatsSeasonAvg.opsRating,
            winRating: teamStatsSeasonAvg.winRating,
            eraRating: teamStatsSeasonAvg.eraRating,
            whipRating: teamStatsSeasonAvg.whipRating,
            ipRating: teamStatsSeasonAvg.ipRating,
            svRating: teamStatsSeasonAvg.svRating,
            kRating: teamStatsSeasonAvg.kRating,
            holdRating: teamStatsSeasonAvg.holdRating,
            saveholdRating: teamStatsSeasonAvg.saveholdRating,
            k9Rating: teamStatsSeasonAvg.k9Rating
        });

        teamTradeImprovement.push({
            name: 'Team after trade',
            overallRating: teamStatsSeasonAvg.overallRating,
            avgRating: teamStatsSeasonAvg.avgRating,
            runRating: teamStatsSeasonAvg.runRating,
            rbiRating: teamStatsSeasonAvg.rbiRating,
            homeRunRating: teamStatsSeasonAvg.homeRunRating,
            sbRating: teamStatsSeasonAvg.sbRating,
            obpRating: teamStatsSeasonAvg.obpRating,
            slgRating: teamStatsSeasonAvg.slgRating,
            doubleRating: teamStatsSeasonAvg.doubleRating,
            walkRating: teamStatsSeasonAvg.walkRating,
            opsRating: teamStatsSeasonAvg.opsRating,
            winRating: teamStatsSeasonAvg.winRating,
            eraRating: teamStatsSeasonAvg.eraRating,
            whipRating: teamStatsSeasonAvg.whipRating,
            ipRating: teamStatsSeasonAvg.ipRating,
            svRating: teamStatsSeasonAvg.svRating,
            kRating: teamStatsSeasonAvg.kRating,
            holdRating: teamStatsSeasonAvg.holdRating,
            saveholdRating: teamStatsSeasonAvg.saveholdRating,
            k9Rating: teamStatsSeasonAvg.k9Rating
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
        var batterLength = 0;
        var pitcherLength = 0;

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

                    if (playerRankingsSeason[j].playerType === "Batter") {
                        batterLength++;
                    } else {
                        pitcherLength++;
                    }

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

                    //Start calculating averages by adding them all up
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
                        k9Rating: (teamStatsSeasonAvg.k9Rating) ? (teamStatsSeasonAvg.k9Rating + k9Rating) : k9Rating
                    }
                    break
                }
            }

            //Same here for recent data
            for (var j = 0; j < playerRankingsRecent.length; j++) {
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayersTrade[i].full, playerRankingsRecent[j].playerName);
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
                        k9Rating: (teamStatsRecentAvg.k9Rating) ? (teamStatsRecentAvg.k9Rating + k9Rating) : k9Rating
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
            k9Rating: Number(teamStatsSeasonAvg.k9Rating / pitcherLength).toFixed(2)
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
            k9Rating: Number(teamStatsRecentAvg.k9Rating / pitcherLength).toFixed(2)
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
                avgRating: Number(parseFloat(this.state.teamTradeImprovement[0].avgRating) - rowInfo.original.avgRating).toFixed(2),
                runRating: Number(parseFloat(this.state.teamTradeImprovement[0].runRating) - rowInfo.original.runRating).toFixed(2),
                rbiRating: Number(parseFloat(this.state.teamTradeImprovement[0].rbiRating) - rowInfo.original.rbiRating).toFixed(2),
                homeRunRating: Number(parseFloat(this.state.teamTradeImprovement[0].homeRunRating) - rowInfo.original.homeRunRating).toFixed(2),
                sbRating: Number(parseFloat(this.state.teamTradeImprovement[0].sbRating) - rowInfo.original.sbRating).toFixed(2),
                obpRating: Number(parseFloat(this.state.teamTradeImprovement[0].obpRating) - rowInfo.original.obpRating).toFixed(2),
                slgRating: Number(parseFloat(this.state.teamTradeImprovement[0].slgRating) - rowInfo.original.slgRating).toFixed(2),
                doubleRating: Number(parseFloat(this.state.teamTradeImprovement[0].doubleRating) - rowInfo.original.doubleRating).toFixed(2),
                walkRating: Number(parseFloat(this.state.teamTradeImprovement[0].walkRating) - rowInfo.original.walkRating).toFixed(2),
                opsRating: Number(parseFloat(this.state.teamTradeImprovement[0].opsRating) - rowInfo.original.opsRating).toFixed(2),
                winRating: Number(parseFloat(this.state.teamTradeImprovement[0].winRating) - rowInfo.original.winRating).toFixed(2),
                eraRating: Number(parseFloat(this.state.teamTradeImprovement[0].eraRating) - rowInfo.original.eraRating).toFixed(2),
                whipRating: Number(parseFloat(this.state.teamTradeImprovement[0].whipRating) - rowInfo.original.whipRating).toFixed(2),
                ipRating: Number(parseFloat(this.state.teamTradeImprovement[0].ipRating) - rowInfo.original.ipRating).toFixed(2),
                svRating: Number(parseFloat(this.state.teamTradeImprovement[0].svRating) - rowInfo.original.svRating).toFixed(2),
                kRating: Number(parseFloat(this.state.teamTradeImprovement[0].kRating) - rowInfo.original.kRating).toFixed(2),
                holdRating: Number(parseFloat(this.state.teamTradeImprovement[0].holdRating) - rowInfo.original.holdRating).toFixed(2),
                saveholdRating: Number(parseFloat(this.state.teamTradeImprovement[0].saveholdRating) - rowInfo.original.saveholdRating).toFixed(2),
                k9Rating: Number(parseFloat(this.state.teamTradeImprovement[0].k9Rating) - rowInfo.original.k9Rating).toFixed(2)
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                avgRating: seasonAvg[0].avgRating,
                runRating: seasonAvg[0].runRating,
                rbiRating: seasonAvg[0].rbiRating,
                homeRunRating: seasonAvg[0].homeRunRating,
                sbRating: seasonAvg[0].sbRating,
                obpRating: seasonAvg[0].obpRating,
                slgRating: seasonAvg[0].slgRating,
                doubleRating: seasonAvg[0].doubleRating,
                walkRating: seasonAvg[0].walkRating,
                opsRating: seasonAvg[0].opsRating,
                winRating: seasonAvg[0].winRating,
                eraRating: seasonAvg[0].eraRating,
                whipRating: seasonAvg[0].whipRating,
                ipRating: seasonAvg[0].ipRating,
                svRating: seasonAvg[0].svRating,
                kRating: seasonAvg[0].kRating,
                holdRating: seasonAvg[0].holdRating,
                saveholdRating: seasonAvg[0].saveholdRating,
                k9Rating: seasonAvg[0].k9Rating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[1].overallRating) + parseFloat(teamTradeImprovement[0].overallRating)).toFixed(2),
                avgRating: Number(parseFloat(this.state.teamTradeImprovement[1].avgRating) + parseFloat(teamTradeImprovement[0].avgRating)).toFixed(2),
                runRating: Number(parseFloat(this.state.teamTradeImprovement[1].runRating) + parseFloat(teamTradeImprovement[0].runRating)).toFixed(2),
                rbiRating: Number(parseFloat(this.state.teamTradeImprovement[1].rbiRating) + parseFloat(teamTradeImprovement[0].rbiRating)).toFixed(2),
                homeRunRating: Number(parseFloat(this.state.teamTradeImprovement[1].homeRunRating) + parseFloat(teamTradeImprovement[0].homeRunRating)).toFixed(2),
                sbRating: Number(parseFloat(this.state.teamTradeImprovement[1].sbRating) + parseFloat(teamTradeImprovement[0].sbRating)).toFixed(2),
                obpRating: Number(parseFloat(this.state.teamTradeImprovement[1].obpRating) + parseFloat(teamTradeImprovement[0].obpRating)).toFixed(2),
                slgRating: Number(parseFloat(this.state.teamTradeImprovement[1].slgRating) + parseFloat(teamTradeImprovement[0].slgRating)).toFixed(2),
                doubleRating: Number(parseFloat(this.state.teamTradeImprovement[1].doubleRating) + parseFloat(teamTradeImprovement[0].doubleRating)).toFixed(2),
                walkRating: Number(parseFloat(this.state.teamTradeImprovement[1].walkRating) + parseFloat(teamTradeImprovement[0].walkRating)).toFixed(2),
                opsRating: Number(parseFloat(this.state.teamTradeImprovement[1].opsRating) + parseFloat(teamTradeImprovement[0].opsRating)).toFixed(2),
                winRating: Number(parseFloat(this.state.teamTradeImprovement[1].winRating) + parseFloat(teamTradeImprovement[0].winRating)).toFixed(2),
                eraRating: Number(parseFloat(this.state.teamTradeImprovement[1].eraRating) + parseFloat(teamTradeImprovement[0].eraRating)).toFixed(2),
                whipRating: Number(parseFloat(this.state.teamTradeImprovement[1].whipRating) + parseFloat(teamTradeImprovement[0].whipRating)).toFixed(2),
                ipRating: Number(parseFloat(this.state.teamTradeImprovement[1].ipRating) + parseFloat(teamTradeImprovement[0].ipRating)).toFixed(2),
                svRating: Number(parseFloat(this.state.teamTradeImprovement[1].svRating) + parseFloat(teamTradeImprovement[0].svRating)).toFixed(2),
                kRating: Number(parseFloat(this.state.teamTradeImprovement[1].kRating) + parseFloat(teamTradeImprovement[0].kRating)).toFixed(2),
                holdRating: Number(parseFloat(this.state.teamTradeImprovement[1].holdRating) + parseFloat(teamTradeImprovement[0].holdRating)).toFixed(2),
                saveholdRating: Number(parseFloat(this.state.teamTradeImprovement[1].saveholdRating) + parseFloat(teamTradeImprovement[0].saveholdRating)).toFixed(2),
                k9Rating: Number(parseFloat(this.state.teamTradeImprovement[1].k9Rating) + parseFloat(teamTradeImprovement[0].k9Rating)).toFixed(2)
            })
        } else {
            teamTradeImprovement.push({
                name: 'Gain/Loss',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[0].overallRating) + rowInfo.original.overallRating).toFixed(2),
                avgRating: Number(parseFloat(this.state.teamTradeImprovement[0].avgRating) + rowInfo.original.avgRating).toFixed(2),
                runRating: Number(parseFloat(this.state.teamTradeImprovement[0].runRating) + rowInfo.original.runRating).toFixed(2),
                rbiRating: Number(parseFloat(this.state.teamTradeImprovement[0].rbiRating) + rowInfo.original.rbiRating).toFixed(2),
                homeRunRating: Number(parseFloat(this.state.teamTradeImprovement[0].homeRunRating) + rowInfo.original.homeRunRating).toFixed(2),
                sbRating: Number(parseFloat(this.state.teamTradeImprovement[0].sbRating) + rowInfo.original.sbRating).toFixed(2),
                obpRating: Number(parseFloat(this.state.teamTradeImprovement[0].obpRating) + rowInfo.original.obpRating).toFixed(2),
                slgRating: Number(parseFloat(this.state.teamTradeImprovement[0].slgRating) + rowInfo.original.slgRating).toFixed(2),
                doubleRating: Number(parseFloat(this.state.teamTradeImprovement[0].doubleRating) + rowInfo.original.doubleRating).toFixed(2),
                walkRating: Number(parseFloat(this.state.teamTradeImprovement[0].walkRating) + rowInfo.original.walkRating).toFixed(2),
                opsRating: Number(parseFloat(this.state.teamTradeImprovement[0].opsRating) + rowInfo.original.opsRating).toFixed(2),
                winRating: Number(parseFloat(this.state.teamTradeImprovement[0].winRating) + rowInfo.original.winRating).toFixed(2),
                eraRating: Number(parseFloat(this.state.teamTradeImprovement[0].eraRating) + rowInfo.original.eraRating).toFixed(2),
                whipRating: Number(parseFloat(this.state.teamTradeImprovement[0].whipRating) + rowInfo.original.whipRating).toFixed(2),
                ipRating: Number(parseFloat(this.state.teamTradeImprovement[0].ipRating) + rowInfo.original.ipRating).toFixed(2),
                svRating: Number(parseFloat(this.state.teamTradeImprovement[0].svRating) + rowInfo.original.svRating).toFixed(2),
                kRating: Number(parseFloat(this.state.teamTradeImprovement[0].kRating) + rowInfo.original.kRating).toFixed(2),
                holdRating: Number(parseFloat(this.state.teamTradeImprovement[0].holdRating) + rowInfo.original.holdRating).toFixed(2),
                saveholdRating: Number(parseFloat(this.state.teamTradeImprovement[0].saveholdRating) + rowInfo.original.saveholdRating).toFixed(2),
                k9Rating: Number(parseFloat(this.state.teamTradeImprovement[0].k9Rating) + rowInfo.original.k9Rating).toFixed(2)
            });

            teamTradeImprovement.push({
                name: 'Current team',
                overallRating: seasonAvg[0].overallRating,
                avgRating: seasonAvg[0].avgRating,
                runRating: seasonAvg[0].runRating,
                rbiRating: seasonAvg[0].rbiRating,
                homeRunRating: seasonAvg[0].homeRunRating,
                sbRating: seasonAvg[0].sbRating,
                obpRating: seasonAvg[0].obpRating,
                slgRating: seasonAvg[0].slgRating,
                doubleRating: seasonAvg[0].doubleRating,
                walkRating: seasonAvg[0].walkRating,
                opsRating: seasonAvg[0].opsRating,
                winRating: seasonAvg[0].winRating,
                eraRating: seasonAvg[0].eraRating,
                whipRating: seasonAvg[0].whipRating,
                ipRating: seasonAvg[0].ipRating,
                svRating: seasonAvg[0].svRating,
                kRating: seasonAvg[0].kRating,
                holdRating: seasonAvg[0].holdRating,
                saveholdRating: seasonAvg[0].saveholdRating,
                k9Rating: seasonAvg[0].k9Rating
            });

            teamTradeImprovement.push({
                name: 'Team after trade',
                overallRating: Number(parseFloat(this.state.teamTradeImprovement[1].overallRating) + parseFloat(teamTradeImprovement[0].overallRating)).toFixed(2),
                avgRating: Number(parseFloat(this.state.teamTradeImprovement[1].avgRating) + parseFloat(teamTradeImprovement[0].avgRating)).toFixed(2),
                runRating: Number(parseFloat(this.state.teamTradeImprovement[1].runRating) + parseFloat(teamTradeImprovement[0].runRating)).toFixed(2),
                rbiRating: Number(parseFloat(this.state.teamTradeImprovement[1].rbiRating) + parseFloat(teamTradeImprovement[0].rbiRating)).toFixed(2),
                homeRunRating: Number(parseFloat(this.state.teamTradeImprovement[1].homeRunRating) + parseFloat(teamTradeImprovement[0].homeRunRating)).toFixed(2),
                sbRating: Number(parseFloat(this.state.teamTradeImprovement[1].sbRating) + parseFloat(teamTradeImprovement[0].sbRating)).toFixed(2),
                obpRating: Number(parseFloat(this.state.teamTradeImprovement[1].obpRating) + parseFloat(teamTradeImprovement[0].obpRating)).toFixed(2),
                slgRating: Number(parseFloat(this.state.teamTradeImprovement[1].slgRating) + parseFloat(teamTradeImprovement[0].slgRating)).toFixed(2),
                doubleRating: Number(parseFloat(this.state.teamTradeImprovement[1].doubleRating) + parseFloat(teamTradeImprovement[0].doubleRating)).toFixed(2),
                walkRating: Number(parseFloat(this.state.teamTradeImprovement[1].walkRating) + parseFloat(teamTradeImprovement[0].walkRating)).toFixed(2),
                opsRating: Number(parseFloat(this.state.teamTradeImprovement[1].opsRating) + parseFloat(teamTradeImprovement[0].opsRating)).toFixed(2),
                winRating: Number(parseFloat(this.state.teamTradeImprovement[1].winRating) + parseFloat(teamTradeImprovement[0].winRating)).toFixed(2),
                eraRating: Number(parseFloat(this.state.teamTradeImprovement[1].eraRating) + parseFloat(teamTradeImprovement[0].eraRating)).toFixed(2),
                whipRating: Number(parseFloat(this.state.teamTradeImprovement[1].whipRating) + parseFloat(teamTradeImprovement[0].whipRating)).toFixed(2),
                ipRating: Number(parseFloat(this.state.teamTradeImprovement[1].ipRating) + parseFloat(teamTradeImprovement[0].ipRating)).toFixed(2),
                svRating: Number(parseFloat(this.state.teamTradeImprovement[1].svRating) + parseFloat(teamTradeImprovement[0].svRating)).toFixed(2),
                kRating: Number(parseFloat(this.state.teamTradeImprovement[1].kRating) + parseFloat(teamTradeImprovement[0].kRating)).toFixed(2),
                holdRating: Number(parseFloat(this.state.teamTradeImprovement[1].holdRating) + parseFloat(teamTradeImprovement[0].holdRating)).toFixed(2),
                saveholdRating: Number(parseFloat(this.state.teamTradeImprovement[1].saveholdRating) + parseFloat(teamTradeImprovement[0].saveholdRating)).toFixed(2),
                k9Rating: Number(parseFloat(this.state.teamTradeImprovement[1].k9Rating) + parseFloat(teamTradeImprovement[0].k9Rating)).toFixed(2)
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
            Header: 'Avg',
            accessor: avgHeader,
            minWidth: 50,
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
            minWidth: 50,
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
            minWidth: 50,
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
            Header: '',
            accessor: 'name',
            minWidth: 100,
            className: "center",
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        backgroundColor: white
                    },
                };
            }
        }, {
            Header: 'Overall',
            accessor: ratingHeader,
            minWidth: 50,
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
            Header: 'Avg',
            accessor: avgHeader,
            minWidth: 50,
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
            minWidth: 50,
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
            minWidth: 50,
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

        //Update the switch stats button text on state change
        var showStatsText;
        var showRecentText;
        if (!this.state.showBBMStats) {
            showStatsText = 'Use BaseballMonster Rankings';
        } else {
            showStatsText = 'Use FantasyBaseball.io Rankings';
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
                        {/* <div className="table-info-header" onClick={this.changeBBMStats}>{showStatsText}</div>
                        <div className="table-info-header" onClick={this.changeRecentStats}>{showRecentText}</div> */}
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