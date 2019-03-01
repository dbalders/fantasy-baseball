import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Cookies from 'js-cookie';

export class StripeBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paid: false

        }
    }

    componentDidMount() {
        this.getPaid();
    }

    getPaid() {
        var paid = Cookies.get('paid');
        if (paid === 'true') {
            this.setState({ 'paid': true });
        }
    }

    render() {
        const publishableKey = "pk_live_1hpF0Z605W8TfOsC1SUcV7Bx";
        var body;

        const onToken = token => {
            var fantasyPlatform = Cookies.get('fantasyPlatform');
            if (fantasyPlatform === 'yahoo') {
                body = {
                    amount: 500,
                    token: token,
                    yahooEmail: Cookies.get('yahooEmail'),
                    leagueId: Cookies.get('leagueId'),
                    teamId: Cookies.get('teamId')
                };
            } else {
                body = {
                    amount: 500,
                    token: token,
                    espnLeagueId: Cookies.get('leagueId'),
                    espnTeamId: Cookies.get('teamId')
                };
            }

            axios
                .post("/api/payment", body)
                .then(response => {
                    this.setState({ 'paid': true })
                    alert("Payment Success");
                    window.location.reload();
                })
                .catch(error => {
                    alert("Payment Error");
                });
        };

        var returnHTML = <StripeCheckout
            label="Get Premium" //Component button text
            name="FantasyBasketball.io" //Modal Header
            description="Access for 2019 and 2020 seasons."
            panelLabel="Go Premium" //Submit button in modal
            amount={500} //Amount in cents $9.99
            token={onToken}
            stripeKey={publishableKey}
            billingAddress={false}
        />

        return returnHTML;
    };
}

export default { StripeBtn };