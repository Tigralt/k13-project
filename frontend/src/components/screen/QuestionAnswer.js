import React, { Component } from 'react';
import { Row, Col, Alert, Progress } from 'reactstrap';

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);

        this.displayAnswer = this.displayAnswer.bind(this);
    }

    displayAnswer(text, points, letter, color, bounce, slide) {
        if (text === '') return null;

        return (
            <Col xs="6" className="text-center">
                <Alert
                    color={color}
                    className={bounce + ' h-100 d-flex'}
                    style={{ lineHeight: '48px' }}
                >
                    <big
                        className="mr-4 flex-shrink-1"
                        style={{ fontSize: '48px' }}
                    >
                        {letter}
                    </big>
                    <div className="flex-fill" style={{ fontSize: '24px' }}>
                        {this.props.handleText(text)}
                    </div>
                    <div className={slide + ' ribbon'}>
                        <div className="text">
                            {points}
                            pt
                        </div>
                    </div>
                </Alert>
            </Col>
        );
    }

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
                    {this.displayAnswer(
                        this.props.question.answers[0].text,
                        this.props.question.answers[0].points,
                        'A',
                        'info',
                        bounce[0],
                        slide[0]
                    )}
                    {this.displayAnswer(
                        this.props.question.answers[1].text,
                        this.props.question.answers[1].points,
                        'B',
                        'danger',
                        bounce[1],
                        slide[1]
                    )}
                </Row>
                <Row className="pb-4">
                    {this.displayAnswer(
                        this.props.question.answers[2].text,
                        this.props.question.answers[2].points,
                        'C',
                        'success',
                        bounce[2],
                        slide[2]
                    )}
                    {this.displayAnswer(
                        this.props.question.answers[3].text,
                        this.props.question.answers[3].points,
                        'D',
                        'warning',
                        bounce[3],
                        slide[3]
                    )}
                </Row>
            </div>
        );
    }
}
export default QuestionAnswer;
