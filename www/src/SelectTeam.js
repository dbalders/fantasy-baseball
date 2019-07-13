import React, { Component } from "react";
import Select from 'react-select';
import Cookies from 'js-cookie';
import { callApi } from './CallApi';

export class SelectTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            multipleTeams: [],
            teamSelected: []
        }
    }

    componentDidMount() {
        var leagueIds = Cookies.get('leagueIds');
        if (leagueIds !== undefined) {
            leagueIds = JSON.parse(leagueIds)
            this.setState({ multipleTeams: leagueIds })
        }
    }

    //On select change, get the new team's info from api and push it into the state and rebuild
    handleMultipleTeamChange = (teamSelected) => {
        this.setState({ teamSelected });
        Cookies.set('leagueId', teamSelected.value)
        Cookies.set('teamId', teamSelected.teamId)
        Cookies.set('teamName', teamSelected.label)
        this.refreshYahooData();
    }

    refreshYahooData() {
        callApi('/api/refresh_yahoo_data/')
            .then(results => {
                //Change the key to re-render the components
                localStorage.removeItem('teamPlayers');
                this.setState({ key: this.state.key + 1 })
                this.forceUpdate();
                localStorage.clear();
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                window.location.href = '/auth/yahoo';
            });
    }

    render() {
        const { teamSelected } = this.state;
        const teamSelect = [];

        if (this.props.placeHolder !== undefined) {
            var placeHolder = this.props.placeHolder;
        } else {
            var placeHolder = 'Switch Leagues (' + Cookies.get('teamName') + ')'
        }

        //Get the league Ids if there is multiple
        if (this.state.multipleTeams.length > 0) {
            for (var i = 0; i < this.state.multipleTeams.length; i++) {
                teamSelect.push({ value: this.state.multipleTeams[i].leagueId, label: this.state.multipleTeams[i].teamName, teamId: this.state.multipleTeams[i].teamId })
            }
        }

        if ((this.state.multipleTeams.length > 1) && (Cookies.get('fantasyPlatform') === 'yahoo')) {
            var returnHTML = <div className="team-select-yahoo">
                <Select
                    value={teamSelected}
                    onChange={this.handleMultipleTeamChange}
                    options={teamSelect}
                    className='react-select-team-container'
                    classNamePrefix='react-select-team'
                    placeholder={placeHolder}
                />
            </div>
        } else {
            var returnHTML = ""
        }

        return returnHTML;
    };
}

export default { SelectTeam };