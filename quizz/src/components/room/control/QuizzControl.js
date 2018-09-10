import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';

class QuizzControl extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Button
                            color="success"
                            size="lg"
                            block
                            disabled={this.props.playing}
                            onClick={this.props.handleStart}
                        >
                            Démarrer la question
                        </Button>
                    </Col>
                </Row>
                <Row className="pt-4">
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Button
                            size="lg"
                            block
                            onClick={this.props.handleNext}
                            disabled={
                                this.props.step + 1 >= this.props.quizzLength
                            }
                        >
                            Question suivante
                        </Button>
                    </Col>
                </Row>

                <Row className="pt-4">
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Button
                            color="danger"
                            size="lg"
                            block
                            onClick={this.props.handleQuit}
                        >
                            Arrêter le quizz
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default QuizzControl;
