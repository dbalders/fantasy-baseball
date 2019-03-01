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
                    //Start calculating averages by adding them all up
                    teamStatsSeasonAvg = {
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
                var similarPlayerRecent = stringSimilarity.compareTwoStrings(teamPlayers[i].full, playerRankingsRecent[k].playerName);
                if (similarPlayerRecent > 0.7) {
                    teamStatsRecent.push(playerRankingsRecent[k]);
                    teamStatsRecentAvg = {
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