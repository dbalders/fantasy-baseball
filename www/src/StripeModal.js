import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { StripeBtn } from "./StripeBtn";
import Cookies from 'js-cookie';

export class StripeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
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

    openModal() {
        this.setState({
            visible: true
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        var returnHTML = <div className='hide'></div>;
        if (!this.state.paid) {
            returnHTML = <div>
                <a onClick={() => this.openModal()}>Get Premium Access</a>
                <Modal visible={this.state.visible} width="50%" height="400px" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="modal-container">
                        <div className="modal-info-container flex-vertical">
                            <div className="modal-info-header">Get premium through the 2020 season</div>
                            <div className="modal-info-desc">
                                <div className="modal-info-text">
                                    Gain access to the trade analysis and many more feautres that will be built out before the start of the 2020 season
                                    (Draft tools, pickup suggestions based on matchups, suggestions based on games left in the week, suggestions based on team comps, and more).
                                </div>
                                <div className="modal-info-text">
                                    Get in early and help drive which new features are added to help you win. Only $5.
                                </div>
                            </div>

                            <StripeBtn />
                        </div>

                    </div>

                </Modal>
            </div>
        }
        return (
            <section>
                {returnHTML}
            </section>
        );
    }
}