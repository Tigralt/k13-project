import React, { Component } from 'react';
import { Row, Col, Alert, Progress } from 'reactstrap';

class QuestionAnswer extends Component {
    render() {
        // Load animation when time limit
        var bounce = [];
        var slide = [];
        for (let i = 0; i < 4; i++) {
            bounce.push(
                parseInt(this.props.question.answers[i].points, 10) <= 0 &&
                this.props.displayStep === 1
                    ? 'bounce-out'
                    : ''
            );
            slide.push(
                parseInt(this.props.question.answers[i].points, 10) > 0 &&
                this.props.displayStep === 1 &&
                this.props.quizzType === 'single'
                    ? 'fade-in-left'
                    : ''
            );
        }

        // Display question & answers
        return (
            <div>
                {this.props.buzzed ? (
                    <div className="buzzed">{this.props.buzzName}</div>
                ) : null}
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <h1>
                            {this.props.handleText(
                                this.props.question.text,
                                0.5
                            )}
                        </h1>
                    </Col>
                </Row>
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <Progress
                            animated
                            color={this.props.color}
                            value={Math.floor(
                                (this.props.time * 100) /
                                    this.props.question.time
                            )}
                        />
                    </Col>
                </Row>
                <Row className="pt-4 pb-3">
                    <Col xs="6" className="text-center">
                        <Alert
                            color="info"
                            className={bounce[0] + ' h-100 d-flex'}
                            style={{ lineHeight: '48px' }}
                        >
                            <big
                                className="mr-4 flex-shrink-1"
                                style={{ fontSize: '48px' }}
                            >
                                A
                            </big>
                            <div
                                className="flex-fill"
                                style={{ fontSize: '24px' }}
                            >
                                {this.props.handleText(
                                    this.props.question.answers[0].text
                                )}
                            </div>
                            <div className={slide[0] + ' ribbon'}>
                                <div className="text">
                                    {this.props.question.answers[0].points}
                                    pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert
                            color="success"
                            className={bounce[2] + ' h-100 d-flex'}
                            style={{ lineHeight: '48px' }}
                        >
                            <big
                                className="mr-4 flex-shrink-1"
                                style={{ fontSize: '48px' }}
                            >
                                C
                            </big>
                            <div
                                className="flex-fill"
                                style={{ fontSize: '24px' }}
                            >
                                {this.props.handleText(
                                    this.props.question.answers[2].text
                                )}
                            </div>
                            <div className={slide[2] + ' ribbon'}>
                                <div className="text">
                                    {this.props.question.answers[2].points}
                                    pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                <Row className="pb-4">
                    <Col xs="6" className="text-center">
                        <Alert
                            color="danger"
                            className={bounce[1] + ' h-100 d-flex'}
                            style={{ lineHeight: '48px' }}
                        >
                            <big
                                className="mr-4 flex-shrink-1"
                                style={{ fontSize: '48px' }}
                            >
                                B
                            </big>
                            <div
                                className="flex-fill"
                                style={{ fontSize: '24px' }}
                            >
                                {this.props.handleText(
                                    this.props.question.answers[1].text
                                )}
                            </div>
                            <div className={slide[1] + ' ribbon'}>
                                <div className="text">
                                    {this.props.question.answers[1].points}
                                    pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert
                            color="warning"
                            className={bounce[3] + ' h-100 d-flex'}
                            style={{ lineHeight: '48px' }}
                        >
                            <big
                                className="mr-4 flex-shrink-1"
                                style={{ fontSize: '48px' }}
                            >
                                D
                            </big>
                            <div
                                className="flex-fill"
                                style={{ fontSize: '24px' }}
                            >
                                {this.props.handleText(
                                    this.props.question.answers[3].text
                                )}
                            </div>
                            <div className={slide[3] + ' ribbon'}>
                                <div className="text">
                                    {this.props.question.answers[3].points}
                                    pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default QuestionAnswer;
