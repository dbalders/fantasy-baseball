import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { StripeBtn } from "./StripeBtn";

export class TradeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            paid: false
        }
    }

    componentDidMount() {
        this.setState({
            paid: this.props.paid,
            visible: !this.props.paid
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
                <Modal visible={this.state.visible} width="50%" height="400px" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="modal-container">
                        <div className="modal-info-container flex-vertical">
                            <div className="modal-info-header">Premium Access Required</div>
                            <div className="modal-info-desc">
                                <div className="modal-info-text">
                                    Gain access to the trade analysis and many more feautres that will be built out before the start of the 2020 season
                                    (Draft tools, pickup suggestions based on matchups, suggestions based on games left in the week, suggestions based on team comps, and more).
                                </div>
                                <div className="modal-info-text">
                                    Also, get in early and help drive which new features are added to help you win. Only $5.
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