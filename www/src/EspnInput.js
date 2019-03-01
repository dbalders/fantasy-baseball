import React, { Component } from 'react';
import { callApi } from './CallApi';

export class EspnInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            espnId: 0
        }

        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() { }

    _handleKeyPress = (e) => {
        //When they press enter
        if (e.key === 'Enter') {
            callApi('/api/espn/league/' + this.state.espnId)
                .then(results => {
                    if (results.messages !== undefined) {
                        //If an error comes back, show the error on the home page
                        this.props.espnIdError(results.messages);
                    } else {
                        //send the league ID over to the server to be added to database
                        //then send back to the home page for further processing
                        this.props.showEspnTeamInput(results, this.state.espnId);
                    }

                })
                .catch(err => {
                    this.props.espnIdError(err.message);
                });
        }
    }

    handleChange(e) {
        this.setState({ espnId: e.target.value });
    }

    render() {
        return (
            <input className="espn-id-input" type="number" placeholder="65944212" onChange={this.handleChange} onKeyPress={this._handleKeyPress} />
        )
    }
}