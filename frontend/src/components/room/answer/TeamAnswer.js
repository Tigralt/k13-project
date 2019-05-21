import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';

class TeamAnswer extends Component {
    render() {
        return (
            <div>
                <Row className="pt-4 pb-4">
                    <Col xs="12">
                        <Button
                            color="danger"
                            size="lg"
                            block
                            style={{ fontSize: '48px', lineHeight: '6em' }}
                            onClick={this.props.handleBuzz}
                            disabled={
                                this.props.confirmed || !this.props.playing
                            }
                            outline={
                                this.props.playing && !this.props.confirmed
                            }
                        >
                            Buzz
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default TeamAnswer;
