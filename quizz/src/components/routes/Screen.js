import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col, Alert, Progress } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactLoading from 'react-loading';

class Screen extends Component {
    constructor(props) {
        super(props);

        this.handleTime = this.handleTime.bind(this);
        fetch('http://quizz.k13-project.com/api/quizz/' + this.props.match.params.id + "/nested")
            .then((response) => response.json())
            .then((quizz) => {
                this.setState({ quizz: quizz  });
                setInterval(() => this.updateRoom(quizz.id), 200);
                setInterval(() => this.handleTime(), 1000);
            });

        this.state = {
            quizz: null,
            room: null,
            display_score: false,
            loading: true,
            state: "stop",
            time: 0,
            color: "info"
        }
    }

    handleTime() {
        if (this.state.room.is_playing == 1 && this.state.quizz.questions[this.state.room.step].time > this.state.time)
            this.setState({ time: this.state.time + 1 });

        const limit = (this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time;
        if (limit < 50)
            this.setState({ color: "info" });
        else if (limit < 75)
            this.setState({ color: "warning" });
        else
            this.setState({ color: "danger" });
    }

    updateRoom(id) {
        fetch('http://quizz.k13-project.com/api/room/quizz/' + id)
            .then((response) => response.json())
            .then((room) => {
                if (room.length == 0)
                    return;

                this.setState({
                    room: room[0],
                    loading: false
                });
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Row>
                        <Col sm="12">
                            <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <div>
                <Row className="pt-4 pb-4">
                    <Col sm="12" className="text-center">
                        <h1>{this.state.quizz.questions[this.state.room.step].text}</h1>
                    </Col>
                </Row>
                <Row className="pt-4 pb-4">
                    <Col sm="12" className="text-center">
                        <Progress animated color={this.state.color} value={Math.floor((this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time)} />
                    </Col>
                </Row>
                <Row className="pt-4 pb-3">
                    <Col sm="6" className="text-center">
                        <Alert color="info" className="clearfix" style={{ "line-height": "48px" }}>
                            <big className="mr-4 float-left" style={{"font-size":"48px"}}>A</big>
                            <div style={{ "font-size": "24px" }}>{this.state.quizz.questions[this.state.room.step].answers[0].text}</div>
                        </Alert>
                    </Col>
                    <Col sm="6" className="text-center">
                        <Alert color="success" className="clearfix" style={{ "line-height": "48px" }}>
                            <big className="mr-4 float-left" style={{"font-size":"48px"}}>C</big>
                            <div style={{ "font-size": "24px" }}>{this.state.quizz.questions[this.state.room.step].answers[1].text}</div>
                        </Alert>
                    </Col>
                </Row>
                <Row className="pb-4">
                    <Col sm="6" className="text-center">
                        <Alert color="danger" className="clearfix" style={{ "line-height": "48px" }}>
                            <big className="mr-4 float-left" style={{"font-size":"48px"}}>B</big>
                            <div style={{ "font-size": "24px" }}>{this.state.quizz.questions[this.state.room.step].answers[2].text}</div>
                        </Alert>
                    </Col>
                    <Col sm="6" className="text-center">
                        <Alert color="warning" className="clearfix" style={{ "line-height": "48px" }}>
                            <big className="mr-4 float-left" style={{"font-size":"48px"}}>D</big>
                            <div style={{ "font-size": "24px" }}>{this.state.quizz.questions[this.state.room.step].answers[3].text}</div>
                        </Alert>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Screen;