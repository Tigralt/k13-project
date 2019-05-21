import React, { Component } from 'react';
import { Button, Row, Col, Jumbotron } from 'reactstrap';

class BuzzControl extends Component {
    render() {
        return (
            <div>
                <Row className="pt-4">
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Jumbotron>
                            <h1 className="text-center">{this.props.name}</h1>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6" md={{ size: 3, offset: 3 }}>
                        <Button
                            color="success"
                            size="lg"
                            block
                            outline
                            onClick={this.props.handleScoreBuzz}
                        >
                            Accepter
                        </Button>
                    </Col>
                    <Col xs="6" md={{ size: 3, offset: 3 }}>
                        <Button
                            color="danger"
                            size="lg"
                            block
                            outline
                            onClick={this.props.handleCancelBuzz}
                        >
                            Refuser
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default BuzzControl;
