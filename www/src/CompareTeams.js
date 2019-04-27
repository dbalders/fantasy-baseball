import React, { Component } from 'react';
import ReactTable from 'react-table';
import Select from 'react-select';
import 'react-table/react-table.css';
import stringSimilarity from 'string-similarity';
import { callApi } from './CallApi';
import Cookies from 'js-cookie';

export class CompareTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamSelected: [],
            compareStatsSeason: [],
            compareStatsRecent: [],
            compareStatsSeasonAvg: [],
            compareStatsRecentAvg: [],
            showCompareTable: false,
            teamPlayers: [],
            tableUpdate: true,
            playerRankingsSeason: [],
            playerRankingsRecent: []

        }
        this.hideCompareTable = this.hideCompareTable.bind(this);
    }

    //On select change, get the new team's info from api and push it into the state and rebuild
    handleTeamChange = (teamSelected) => {
        this.setState({ teamSelected });
        callApi('/api/teams/' + this.props.leagueId + '/' + teamSelected.value)
            .then(results => {
                this.setState({ showCompareTable: true });
                this.setState({ teamPlayers: results }, function () {
                    this.buildTeam(this.state.teamPlayers);
                    Cookies.set('teamSelectedValue', teamSelected.value);
                    Cookies.set('teamSelectedLabel', teamSelected.label);
                })
            })
            .catch(err => console.log(err));
    }

    //hide the compare table when clicked
    hideCompareTable() {
        this.setState({ showCompareTable: false });
        Cookies.remove('teamSelectedValue');
        Cookies.remove('teamSelectedLabel');
    }

    componentDidMount() {
        var compareTeam = Cookies.get('teamSelectedValue');

        if (compareTeam) {

            var teamSelected = {
                value: compareTeam,
                label: Cookies.get('teamSelectedLabel')
            };

            var playerRankingsSeason = JSON.parse(localStorage.getItem('playerRankingsSeason'));
            var playerRankingsRecent = JSON.parse(localStorage.getItem('playerRankingsRecent'));

            if (!playerRankingsSeason) {
                playerRankingsSeason = this.props.playerRankingsSeason;
            }
            if (!playerRankingsRecent) {
                playerRankingsRecent = this.props.playerRankingsRecent;
            }

            this.setState({
                playerRankingsSeason: playerRankingsSeason,
                playerRankingsRecent: playerRankingsRecent
            }, function () {
                this.handleTeamChange(teamSelected)
            })
        }
    }

    //Build the table based on the team data
    buildTeam(team) {
        var teamStatsSeason = [];
        var teamStatsRecent = [];
        var teamStatsSeasonAvg = [];
        var teamStatsRecentAvg = [];
        var teamPlayers = team;
        var playerRankingsSeason = [];
        var playerRankingsRecent = [];
        var batterLength = 0;
        var pitcherLength = 0;

        if ((this.state.playerRankingsSeason.length === 0) || (this.state.playerRankingsRecent.length === 0)) {
            playerRankingsSeason = JSON.parse(localStorage.getItem('playerRankingsSeason'));
            playerRankingsRecent = JSON.parse(localStorage.getItem('playerRankingsRecent'));
        } else {
            playerRankingsSeason = this.state.playerRankingsSeason;
            playerRankingsRecent = this.state.playerRankingsRecent;
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

            // Same here for recent data
            for (var k = 0; k < playerRankingsRecent.length; k++) {
                
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsRecent[k].playerName);
                if (similarPlayerRecent > 0.7) {
                    teamStatsRecent.push(playerRankingsRecent[k]);

                    var avgRating = (playerRankingsRecent[k].avgRating) ? (playerRankingsRecent[k].avgRating) : 0;
                    var runRating = (playerRankingsRecent[k].runRating) ? (playerRankingsRecent[k].runRating) : 0;
                    var rbiRating = (playerRankingsRecent[k].rbiRating) ? (playerRankingsRecent[k].rbiRating) : 0;
                    var homeRunRating = (playerRankingsRecent[k].homeRunRating) ? (playerRankingsRecent[k].homeRunRating) : 0;
                    var sbRating = (playerRankingsRecent[k].sbRating) ? (playerRankingsRecent[k].sbRating) : 0;
                    var obpRating = (playerRankingsRecent[k].obpRating) ? (playerRankingsRecent[k].obpRating) : 0;
                    var slgRating = (playerRankingsRecent[k].slgRating) ? (playerRankingsRecent[k].slgRating) : 0;
                    var doubleRating = (playerRankingsRecent[k].doubleRating) ? (playerRankingsRecent[k].doubleRating) : 0;
                    var walkRating = (playerRankingsRecent[k].walkRating) ? (playerRankingsRecent[k].walkRating) : 0;
                    var opsRating = (playerRankingsRecent[k].opsRating) ? (playerRankingsRecent[k].opsRating) : 0;
                    var winRating = (playerRankingsRecent[k].winRating) ? (playerRankingsRecent[k].winRating) : 0;
                    var eraRating = (playerRankingsRecent[k].eraRating) ? (playerRankingsRecent[k].eraRating) : 0;
                    var whipRating = (playerRankingsRecent[k].whipRating) ? (playerRankingsRecent[k].whipRating) : 0;
                    var ipRating = (playerRankingsRecent[k].ipRating) ? (playerRankingsRecent[k].ipRating) : 0;
                    var svRating = (playerRankingsRecent[k].svRating) ? (playerRankingsRecent[k].svRating) : 0;
                    var kRating = (playerRankingsRecent[k].kRating) ? (playerRankingsRecent[k].kRating) : 0;
                    var holdRating = (playerRankingsRecent[k].holdRating) ? (playerRankingsRecent[k].holdRating) : 0;
                    var saveholdRating = (playerRankingsRecent[k].saveholdRating) ? (playerRankingsRecent[k].saveholdRating) : 0;
                    var k9Rating = (playerRankingsRecent[k].k9Rating) ? (playerRankingsRecent[k].k9Rating) : 0;


                    teamStatsRecentAvg = {
                        overallRating: (teamStatsRecentAvg.overallRating) ? (teamStatsRecentAvg.overallRating + playerRankingsRecent[k].overallRating) : playerRankingsRecent[k].overallRating,
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
            overallRating: Number(teamStatsRecentAvg.overallRating / batterLength).toFixed(2),
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

    render() {
        const { teamSelected } = this.state;
        const teamSelect = [];

        //Get the team names from a prop and push it into teamSelect for select dropdown
        for (var i = 0; i < this.props.teams.length; i++) {
            teamSelect.push({ value: this.props.teams[i].team_id, label: this.props.teams[i].name })
        }

        //If the parent says to update the table, rebuild the table with new data
        if ((this.props.updateCompareTable)) {
            this.buildTeam(this.state.teamPlayers);
        }

        return (
            <div className={`table-group ${this.state.showCompareTable ? 'compare-table-group' : ''}`}>

                <h3 className="team-table-header compare-header">{this.props.title}</h3>
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
                    <div className={`team-avg-table ${this.props.showRecentRankings ? 'hide' : ''}`}>
                        <ReactTable
                            data={this.state.compareStatsSeasonAvg}
                            columns={this.props.columnNamesAvg}
                            showPagination={false}
                            minRows={0}
                        />
                    </div>
                    <div className={`team-avg-table ${this.props.showRecentRankings ? '' : 'hide'}`}>
                        <ReactTable
                            data={this.state.compareStatsRecentAvg}
                            columns={this.props.columnNamesAvg}
                            showPagination={false}
                            minRows={0}
                        />
                    </div>
                    <div className={`team-table ${this.props.showRecentRankings ? 'hide' : ''}`}>
                        <ReactTable
                            data={this.state.compareStatsSeason}
                            columns={this.props.columnNames}
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
                                        columns={this.props.expandedColumnNames}
                                        showPagination={false}
                                        defaultPageSize={1}
                                        className="expandedRow"
                                    />
                                );
                            }}
                        />
                    </div>

                    <div className={`team-table ${this.props.showRecentRankings ? '' : 'hide'}`}>
                        <ReactTable
                            data={this.state.compareStatsRecent}
                            columns={this.props.columnNames}
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
                                        columns={this.props.expandedColumnNames}
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
        )
    }
}