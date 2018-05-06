import React, { Component } from 'react';
import { Row, Col, Alert, Progress } from 'reactstrap';
import ReactLoading from 'react-loading';
import { formURLEncode } from './../../utils/Utils.js';
import API_URL from './../../utils/Config.js';

class Screen extends Component {
    constructor(props) {
        super(props);

        this.handleTime = this.handleTime.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.handleNext = this.handleNext.bind(this);

        fetch(API_URL + 'quizz/' + this.props.match.params.id + "/nested")
            .then((response) => response.json())
            .then((quizz) => {
                this.setState({ quizz: quizz  });
                setInterval(() => this.updateRoom(quizz.id), 200);
                setInterval(() => this.handleTime(), 1000);
            });

        this.state = {
            quizz: null,
            room: null,
            players: null,
            display_score: false,
            loading: true,
            time: 0,
            color: "info",
            image: false,
        }
    }

    handleTime() {
        if (this.state.room === null)
            return;

        if (parseInt(this.state.room.is_playing, 10) === 1 && this.state.quizz.questions[this.state.room.step].time > this.state.time)
            this.setState({ time: this.state.time + 1 });

        const limit = (this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time;
        if (limit < 50)
            this.setState({ color: "info" });
        else if (limit < 75)
            this.setState({ color: "warning" });
        else
            this.setState({ color: "danger" });

        if (limit >= 100) {
            this.setState({
                loading: true
            });

            this.handleScore();
            fetch(API_URL + 'room/' + this.state.room.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formURLEncode({
                    "is_playing": 0
                })
            }).then((response) => {
                this.setState({
                    time: 0,
                    color: "info"
                });
            });
        }
    }

    handleScore() {
        fetch(API_URL + 'player/room/' + this.state.room.id)
            .then((response) => response.json())
            .then((players) => {
                players.sort(function(a,b) {
                    if (a.score > b.score)
                        return -1;
                    if (a.score < b.score)
                        return 1;
                    return 0;
                });

                this.setState({
                    players: players,
                    loading: false,
                    display_score: true
                });
            });
    }

    handleNext() {
        this.setState({
            display_score: false,
            loading: true
        });
    }

    updateRoom(id) {
        fetch(API_URL + 'room/quizz/' + id)
            .then((response) => response.json())
            .then((room) => {
                if (room.length === 0)
                    return;

                if (this.state.room != null && parseInt(room[0].step, 10) > parseInt(this.state.room.step, 10))
                    this.handleNext();

                this.setState({
                    room: room[0],
                    loading: false
                });
            });
    }

    handleText(text) {
        const regex = /\[img\](.*)\[\/img\]/g;
        const match = text.match(regex)

        if (match === null)
            return text;
        else {
            const url = text.replace(regex, "$1");
            return (
                <img src={url} height="200px"/>
            );
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Row>
                        <Col xs="12">
                            <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                        </Col>
                    </Row>
                </div>
            )
        }

        if (this.state.display_score) {
            var display = ["er"];
            for (let i=0; i<this.state.players.length; i++)
                display.push("ème");
            const final = parseInt(this.state.room.step, 10)+1 >= this.state.quizz.questions.length? "final": "";

            return (
                <div>
                    <Row>
                        <Col xs="12">
                            <h1 className="text-center">Tableau des scores {final}</h1>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.players.map((player, index) =>
                        <Col xs="6">
                            <Alert color="dark" className="d-flex" style={{ lineHeight: "48px" }}>
                                <big className="flex-fill text-left" style={{fontSize:"48px"}}>
                                    {index+1}{display[index]}
                                </big>
                                <div style={{ fontSize: "24px" }} className="text-center flex-fill">{player.name}</div>
                                <big className="flex-fill text-right" style={{ fontSize:"36px" }}>{player.score} pt</big>
                            </Alert>
                        </Col>
                        )}
                    </Row>
                </div>
            )
        }

        return (
            <div>
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <h1>{this.handleText(this.state.quizz.questions[this.state.room.step].text)}</h1>
                    </Col>
                </Row>
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <Progress animated color={this.state.color} value={Math.floor((this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time)} />
                    </Col>
                </Row>
                <Row className="pt-4 pb-3">
                    <Col xs="6" className="text-center">
                        <Alert color="info" className="clearfix" style={{ lineHeight: "48px" }}>
                            <big className="mr-4 float-left" style={{fontSize:"48px"}}>A</big>
                            <div style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[0].text)}</div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert color="success" className="clearfix" style={{ lineHeight: "48px" }}>
                            <big className="mr-4 float-left" style={{fontSize:"48px"}}>C</big>
                            <div style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[2].text)}</div>
                        </Alert>
                    </Col>
                </Row>
                <Row className="pb-4">
                    <Col xs="6" className="text-center">
                        <Alert color="danger" className="clearfix" style={{ lineHeight: "48px" }}>
                            <big className="mr-4 float-left" style={{fontSize:"48px"}}>B</big>
                            <div style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[1].text)}</div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert color="warning" className="clearfix" style={{ lineHeight: "48px" }}>
                            <big className="mr-4 float-left" style={{fontSize:"48px"}}>D</big>
                            <div style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[3].text)}</div>
                        </Alert>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Screen;