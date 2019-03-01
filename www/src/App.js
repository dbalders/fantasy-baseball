import React, { Component } from 'react';
import { BuildPlayers } from './BuildPlayers';
import { HomePage } from './HomePage';
import { TradeAnalysis } from './TradeAnalysys';
import Cookies from 'js-cookie';
// import YahooSigninImage from './images/yahoo-signin.png'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { callApi } from './CallApi';
import { StripeBtn } from "./StripeBtn";
import { StripeModal } from "./StripeModal";
import CookieConsent from "react-cookie-consent";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navText: '',
            isLoggedIn: false,
            fantasyPlatform: false,
            has_error: false,
            key: 1
        }

        this.refreshYahooData = this.refreshYahooData.bind(this);
    }

    componentDidMount() {
        var teamId = Cookies.get('teamId');

        if (teamId !== undefined) {
            this.setState({ navText: 'Refresh Yahoo Data' });
            this.setState({ isLoggedIn: true });
        } else {
            this.setState({ navText: 'Sign in with Yahoo' });
            window.localStorage.clear();
        }

        var fantasyPlatform = Cookies.get('fantasyPlatform');
        if (fantasyPlatform === 'yahoo') {
            this.setState({ 'fantasyPlatform': true })
        }
    }

    refreshYahooData() {
        callApi('/api/refresh_yahoo_data/')
            .then(results => {
                //Change the key to re-render the components
                localStorage.removeItem('teamPlayers');
                this.setState({ key: this.state.key + 1 })
                this.forceUpdate();
            })
            .catch(err => {
                console.log(err);
                window.location.href = '/auth/yahoo';
            });
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        var homePage;
        var navBar;
        var footer;
        var paid = Cookies.get('paid')
        var lockSymbol;

        if (!isLoggedIn) {
            homePage = <HomePage key={this.state.key} />;
        } else {
            homePage = <BuildPlayers key={this.state.key} />;
        }

        if (String(paid) === 'true') {
            lockSymbol = <img className="locked" src="/images/unlock.png" />
        } else {
            lockSymbol = <img className="locked" src="/images/lock.png" />
        }

        navBar = <div className={`navbar flex ${this.state.isLoggedIn ? '' : 'hide'}`}>
            <div className="nav-title">
                <Link to="/">FantasyBasketball.io</Link>
            </div>
            <div className="nav-sign-in flex">
                <div className={`nav-refresh ${this.state.isLoggedIn ? '' : 'hide'}`}>
                    <StripeModal />
                </div>
                <div className={`nav-refresh ${this.state.isLoggedIn ? '' : 'hide'}`}>
                    <Link to="/trade">Trade Analysis {lockSymbol}</Link>
                </div>

                <div className={`nav-refresh ${this.state.isLoggedIn ? '' : 'hide'} ${this.state.fantasyPlatform ? '' : 'hide'}`} onClick={this.refreshYahooData}>
                    <a>Refresh Yahoo Data</a>
                </div>
                <div className={`sign-out ${this.state.isLoggedIn ? '' : 'hide'}`}>
                    <a href="/logout">Logout</a>
                </div>
            </div>

        </div>

        footer = <div className="footer">
            <div className="footer-info-container flex">
                <div className="footer-info flex">
                    <div id="footer-created-by">Created by </div>
                    <div>
                        <a href="https://twitter.com/davidbalderston">David Balderston</a>
                    </div>
                    <a className="footer-twitter flex" href="https://twitter.com/davidbalderston">
                        <img src="/images/twitterlogo.png" />
                    </a>
                </div>
            </div>
        </div>

        return (
            <Router>
                <div className="site-container flex-vertical">
                    {navBar}
                    <Route path="/" exact render={() => homePage} />
                    <Route path="/trade/" component={TradeAnalysis} />
                    <CookieConsent
                        location="bottom"
                        buttonText="Accept"
                        cookieName="cookie-concent"
                        style={{ background: "#2B373B" }}
                        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                        expires={365}
                    >
                        This website uses cookies to enhance the user experience.{" "}
                    </CookieConsent>
                    {footer}
                </div>
            </Router>
        );
    }
};

export default App;