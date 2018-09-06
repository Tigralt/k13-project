import React, { Component } from 'react';
import { Row, Col, Alert, Progress } from 'reactstrap';
import ReactLoading from 'react-loading';
import PlayerScore from "./../score/PlayerScore";
import CONFIG from './../../utils/Config.js';

class Screen extends Component {
    constructor(props) {
        super(props);

        this.handleTime = this.handleTime.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.joinRoom = this.joinRoom.bind(this);

        fetch(CONFIG.API_URL + 'quizz/' + this.props.match.params.id + "/nested")
            .then((response) => response.json())
            .then((quizz) => {
                this.setState({ quizz: quizz  }, () => this.joinRoom());
                setInterval(() => this.handleTime(), 1000);
            });

        this.state = {
            quizz: null,
            room: null,
            players: null,
            players_old: null,
            update: null,
            display_step: 0,
            playing: false,
            loading: true,
            time: 0,
            color: "info",
            image: false,
            buzzed: false,
        }
    }

    joinRoom() {
        fetch(CONFIG.API_URL + 'room/quizz/' + this.state.quizz.id)
            .then((response) => response.json())
            .then((room) => {
                if (room.length === 0)
                    return;
                
                const conn = new WebSocket(CONFIG.SERVER_URL);
                conn.onopen = (e) => {
                    conn.send(`joinRoom|${room[0].id}|screen`);
                }
                conn.onmessage = (e) => {
                    console.log(e.data);
                    switch(e.data) {
                        case "startQuestion": this.setState({ playing: true }); break;
                        case "pauseQuestion": this.setState({ playing: false }); break;
                        case "nextQuestion":  this.handleNext(); break;
                        case "quitRoom": this.state.update.close(); this.props.history.push("/home"); break;
                        default:
                    }
                }

                this.setState({
                    room: room[0],
                    loading: false,
                    update: conn,
                });
            });
    }

    handleTime() {
        // Timer paused
        if (!this.state.playing || this.state.display_step > 0)
            return;

        // Update timer
        if (this.state.playing && this.state.quizz.questions[this.state.room.step].time > this.state.time)
            this.setState({ time: this.state.time + 1 });

        // Set timer color
        const limit = (this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time;
        if (limit < 50)
            this.setState({ color: "info" });
        else if (limit < 75)
            this.setState({ color: "warning" });
        else
            this.setState({ color: "danger" });

        // Time limit
        if (limit >= 100) {
            this.handleScore();
            this.setState({playing: false});
        }
    }

    handleScore() {
        const waiting_ms = 5000;

        fetch(CONFIG.API_URL + 'player/room/' + this.state.room.id)
            .then((response) => response.json())
            .then((players) => {
                players.sort(function(a,b) {
                    if (parseInt(a.score, 10) > parseInt(b.score, 10))
                        return -1;
                    if (parseInt(a.score, 10) < parseInt(b.score, 10))
                        return 1;
                    return 0;
                });

                this.setState({
                    players_old: this.state.players,
                    players: players,
                    display_step: 1
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            display_step: 2,
                            time: 0,
                            color: "info"
                        }, () => {
                            setTimeout(() => {
                                this.setState({ display_step: 3 });
                            }, waiting_ms);    
                        });
                    }, waiting_ms);
                });
            });
    }

    handleNext() {
        this.setState({
            display_step: 0,
            loading: true
        }, () => {
            fetch(CONFIG.API_URL + 'room/quizz/' + this.state.quizz.id)
            .then((response) => response.json())
            .then((room) => {
                if (room.length === 0)
                    return;

                this.setState({
                    room: room[0],
                    loading: false
                });
            });
        });
    }
    
    handleBuzz() {

    }

    handleText(text, height=0.30) {
        const regex = /\[img\](.*)\[\/img\]/g;
        const match = text.match(regex)

        if (match === null)
            return text;
        else {
            const url = text.replace(regex, "$1");
            const imgHeight = window.innerHeight * height - 150;

            if (imgHeight <= 0)
                return "Erreur: écran trop petit";

            return (
                <img src={url} height={imgHeight+"px"} alt=""/>
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

        // Display score
        if (this.state.display_step >= 2) {
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
                                <PlayerScore score={parseInt(player.score, 10)} old={this.state.players_old === null?null:parseInt(this.state.players_old[index].score, 10)} step={this.state.display_step-2}/>
                            </Alert>
                        </Col>
                        )}
                    </Row>
                </div>
            )
        }

        // Load animation when time limit
        var bounce = [];
        var slide = [];
        for (let i=0; i<4; i++) {
            bounce.push(parseInt(this.state.quizz.questions[this.state.room.step].answers[i].points, 10) <= 0 && this.state.display_step === 1?"bounce-out":"");
            slide.push(parseInt(this.state.quizz.questions[this.state.room.step].answers[i].points, 10) > 0 && this.state.display_step === 1?"fade-in-left":"");
        }

        // Display question & answers
        return (
            <div>
                { this.state.buzzed ? <div className="buzzed">Buzz</div> : null }
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <h1>{this.handleText(this.state.quizz.questions[this.state.room.step].text, 0.5)}</h1>
                    </Col>
                </Row>
                <Row className="pt-4 pb-4">
                    <Col xs="12" className="text-center">
                        <Progress animated color={this.state.color} value={Math.floor((this.state.time * 100) / this.state.quizz.questions[this.state.room.step].time)} />
                    </Col>
                </Row>
                <Row className="pt-4 pb-3">
                    <Col xs="6" className="text-center">
                        <Alert color="info" className={bounce[0] + " h-100 d-flex"} style={{ lineHeight: "48px" }}>
                            <big className="mr-4 flex-shrink-1" style={{fontSize:"48px"}}>A</big>
                            <div className="flex-fill" style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[0].text)}</div>
                            <div className={slide[0] + " ribbon"}>
                                <div className="text">
                                    {this.state.quizz.questions[this.state.room.step].answers[0].points}pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert color="success" className={bounce[2] + " h-100 d-flex"} style={{ lineHeight: "48px" }}>
                            <big className="mr-4 flex-shrink-1" style={{fontSize:"48px"}}>C</big>
                            <div className="flex-fill" style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[2].text)}</div>
                            <div className={slide[2] + " ribbon"}>
                                <div className="text">
                                    {this.state.quizz.questions[this.state.room.step].answers[2].points}pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
                <Row className="pb-4">
                    <Col xs="6" className="text-center">
                        <Alert color="danger" className={bounce[1] + " h-100 d-flex"} style={{ lineHeight: "48px" }}>
                            <big className="mr-4 flex-shrink-1" style={{fontSize:"48px"}}>B</big>
                            <div className="flex-fill" style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[1].text)}</div>
                            <div className={slide[1] + " ribbon"}>
                                <div className="text">
                                    {this.state.quizz.questions[this.state.room.step].answers[1].points}pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                    <Col xs="6" className="text-center">
                        <Alert color="warning" className={bounce[3] + " h-100 d-flex"} style={{ lineHeight: "48px" }}>
                            <big className="mr-4 flex-shrink-1" style={{fontSize:"48px"}}>D</big>
                            <div className="flex-fill" style={{ fontSize: "24px" }}>{this.handleText(this.state.quizz.questions[this.state.room.step].answers[3].text)}</div>
                            <div className={slide[3] + " ribbon"}>
                                <div className="text">
                                    {this.state.quizz.questions[this.state.room.step].answers[3].points}pt
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Screen;