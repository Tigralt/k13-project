import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';

class DefaultAnswer extends Component {
    render() {
        return (
            <div>
                <Row className="pt-4 pb-4">
                    <Col xs="6">
                        <Button
                            color="info"
                            size="lg"
                            block
                            style={{ fontSize: '48px' }}
                            onClick={() => this.props.handleChoice(0)}
                            active={this.props.selected.includes(0)}
                            disabled={
                                this.props.confirmed || !this.props.playing
                            }
                            outline={this.props.playing}
                        >
                            A
                        </Button>
                    </Col>
                    <Col xs="6">
                        <Button
                            color="danger"
                            size="lg"
                            block
                            style={{ fontSize: '48px' }}
                            onClick={() => this.props.handleChoice(1)}
                            active={this.props.selected.includes(1)}
                            disabled={
                                this.props.confirmed || !this.props.playing
                            }
                            outline={this.props.playing}
                        >
                            B
                        </Button>
                    </Col>
                </Row>
                <Row className="pt-1 pb-4">
                    <Col xs="6">
                        <Button
                            color="success"
                            size="lg"
                            block
                            style={{ fontSize: '48px' }}
                            onClick={() => this.props.handleChoice(2)}
                            active={this.props.selected.includes(2)}
                            disabled={
                                this.props.confirmed || !this.props.playing
                            }
                            outline={this.props.playing}
                        >
                            C
                        </Button>
                    </Col>
                    <Col xs="6">
                        <Button
                            color="warning"
                            size="lg"
                            block
                            style={{ fontSize: '48px' }}
                            onClick={() => this.props.handleChoice(3)}
                            active={this.props.selected.includes(3)}
                            disabled={
                                this.props.confirmed || !this.props.playing
                            }
                            outline={this.props.playing}
                        >
                            D
                        </Button>
                    </Col>
                </Row>
                <Row className="pt-4 pb-4">
                    <Col xs="12">
                        <Button
                            color="secondary"
                            size="lg"
                            block
                            style={{ fontSize: '48px' }}
                            onClick={this.props.handleConfirm}
                            disabled={this.props.confirmed}
                        >
                            Valider
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default DefaultAnswer;
