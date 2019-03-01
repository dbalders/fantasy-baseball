import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
 
export class EspnModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }
 
    openModal() {
        this.setState({
            visible : true
        });
    }
 
    closeModal() {
        this.setState({
            visible : false
        });
    }
 
    render() {
        return (
            <section>
                <div className="landing-text-small" onClick={() => this.openModal()}>(How to find league ID?)</div>
                <Modal visible={this.state.visible} width="50%" height="50%" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="espn-modal-container flex-vertical">
                        <div>Log into your ESPN fantasy league.</div>
                        <div>Look at the ESPN website URL. Near the end, it will say <span className="espn-modal-league">LeagueId=12345678</span>.</div>
                        <div>Copy the numbers and paste into the box and hit Enter.</div>
                        <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </Modal>
            </section>
        );
    }
}