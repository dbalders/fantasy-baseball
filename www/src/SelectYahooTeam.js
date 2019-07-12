import React, { Component } from "react";
import { SelectTeam } from './SelectTeam';


export class SelectYahooTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="landing-container flex-vertical flex-one">
                <div className="flex flex-one center">
                    <SelectTeam placeHolder="Select your Team" />
                </div>

            </div>

        )
    }
}

export default { SelectTeam };