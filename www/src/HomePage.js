import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Select from 'react-select';
import { EspnInput } from './EspnInput';
import { EspnModal } from './EspnModal';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-135378238-1');
ReactGA.pageview("/");

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            espnTeamSelected: [],
            espnTeamSelect: [],
            showEspnInput: false,
            espnId: 0,
            espnIdError: null
        }
        this.showEspnTeamInput = this.showEspnTeamInput.bind(this);
        this.espnIdError = this.espnIdError.bind(this);
    }

    componentDidMount() { }

    showEspnTeamInput = (teamsArray, espnId) => {

        const teamSelect = [];
        for (var i = 0; i < teamsArray.length; i++) {
            teamSelect.push({ value: teamsArray[i].team_id, label: teamsArray[i].name })
        }

        this.setState({
            showEspnInput: true,
            espnTeamSelect: teamSelect,
            espnId: espnId,
            espnIdError: null
        })
    }

    espnIdError = (error) => {
        this.setState({ espnIdError: error });

        if (error === 'Not Found') {
            this.setState({ espnIdError: 'ESPN league is not found' });
        }

        if (error === 'You are not authorized to view this League.') {
            this.setState({ espnIdError: 'This league is private, it has to be made public.' });
        }
    }

    handleEspnTeamChange = (espnTeamSelected) => {
        Cookies.set('leagueId', this.state.espnId);
        Cookies.set('teamId', espnTeamSelected.value);
        Cookies.set('fantasyPlatform', 'espn');

        var url = '/api/payment/espn/' + this.state.espnId + '/' + espnTeamSelected.value;
        fetch(url)
            .then(res => res.text())
            .then(function () {
                window.location.reload()
            });
    }

    render() {
        const { espnTeamSelected } = this.state;
        const { espnTeamSelect } = this.state;

        return (
            <div className="landing-container flex-vertical flex-one">
                <div className="landing-top-background">
                    <div className="landing-top-container flex-vertical">
                        <div className="landing-site">FantasyBasketball.io</div>
                        <div className="landing-site-title">Insights into your fantasy league</div>
                        <div className="landing-site-desc">Get analytical data on your team, compare it to the rest of the league, see who to pick up, analyse trades, and more.</div>
                        <div className="landing-laptop-img">
                            <img src="/images/fantasy_homepage.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-actions-container flex">
                    <div className="landing-actions flex-vertical landing-actions-left">
                        <div className="landing-img">
                            <img id="landing-yahoo-img" src="/images/yahoologo.png" />
                        </div>
                        <div className="landing-text">Access your Yahoo team</div>
                        <div className="landing-buttons flex">
                            <div className="sign-in">
                                <a href="/auth/yahoo">Sign in with Yahoo</a>
                            </div>
                        </div>
                    </div>
                    <div className="landing-actions flex-vertical landing-actions-right">
                        <div className="landing-img">
                            <img id="landing-espn-img" src="/images/espnlogo.png" />
                        </div>
                        <div className="landing-text">Enter ESPN League Id
                            <EspnModal />
                        </div>

                        <div className="landing-buttons flex">
                            <EspnInput showEspnTeamInput={this.showEspnTeamInput} espnIdError={this.espnIdError} />
                        </div>
                        <div className={`team-select ${this.state.showEspnInput ? '' : 'hide'}`}>
                            <Select
                                value={espnTeamSelected}
                                onChange={this.handleEspnTeamChange}
                                options={espnTeamSelect}
                                placeholder='Select your team'
                                className='react-select-container'
                                classNamePrefix='react-select'
                            />
                        </div>
                        <div className={`espn-error ${this.state.espnIdError ? '' : 'hide'}`}>
                            <div>{this.state.espnIdError}</div>
                        </div>
                    </div>
                </div>
                <div className="landing-features-container flex flex-one">
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-title">Team Categorical Breakdown</div>
                        <div className="landing-features-desc">See how every player on your team breaksdown by each scoring category. See how they rank for the season or for the last two weeks.</div>
                    </div>
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-img">
                            <img src="/images/fantasy_homepage_small.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-features-container flex flex-one flex-reverse">
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-title">Pickup Suggestions</div>
                        <div className="landing-features-desc">See the top ranked pickups for the season and the last two weeks. See their breakdowns so you know what they can bring to your team.</div>
                    </div>
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-img">
                            <img src="/images/fantasy_pickups.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-features-container flex flex-one">
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-title">Compare with Other Teams</div>
                        <div className="landing-features-desc">See how your team compares to the other teams in your league. Win your matchup by knowing where your opponent is weak and capitalizing.</div>
                    </div>
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-img">
                            <img src="/images/fantasy_compare.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-features-container flex flex-one flex-reverse">
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-title">Trade Analysis</div>
                        <div className="landing-features-desc">Analyse trades before you accept to make sure you are coming out ahead and filling holes or increasing your team's strengths.</div>
                    </div>
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-img">
                            <img src="/images/fantasy_trade.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-features-container flex flex-one">
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-title">More to come...</div>
                        <div className="landing-features-desc">Many more features planned for the start of next season. Matchup based suggestions, games left in the week, drop suggestions, drafting tools, and more...</div>
                    </div>
                    <div className="landing-features flex-vertical">
                        <div className="landing-features-img">
                            <img src="/images/fantasy_next.png" />
                        </div>
                    </div>
                </div>
                <div className="landing-actions-container flex">
                    <div className="landing-actions flex-vertical landing-actions-left">
                        <div className="landing-img">
                            <img id="landing-yahoo-img" src="/images/yahoologo.png" />
                        </div>
                        <div className="landing-text">Access your Yahoo team</div>
                        <div className="landing-buttons flex">
                            <div className="sign-in">
                                <a href="/auth/yahoo">Sign in with Yahoo</a>
                            </div>
                        </div>
                    </div>
                    <div className="landing-actions flex-vertical landing-actions-right">
                        <div className="landing-img">
                            <img id="landing-espn-img" src="/images/espnlogo.png" />
                        </div>
                        <div className="landing-text">Enter ESPN League Id
                            <EspnModal />
                        </div>

                        <div className="landing-buttons flex">
                            <EspnInput showEspnTeamInput={this.showEspnTeamInput} espnIdError={this.espnIdError} />
                        </div>
                        <div className={`team-select ${this.state.showEspnInput ? '' : 'hide'}`}>
                            <Select
                                value={espnTeamSelected}
                                onChange={this.handleEspnTeamChange}
                                options={espnTeamSelect}
                                placeholder='Select your team'
                                className='react-select-container'
                                classNamePrefix='react-select'
                            />
                        </div>
                        <div className={`espn-error ${this.state.espnIdError ? '' : 'hide'}`}>
                            <div>{this.state.espnIdError}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}