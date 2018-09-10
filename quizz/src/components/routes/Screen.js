import React, { Component } from 'react';
import Loading from "../Loading";
import Score from "./../screen/Score";
import QuestionAnswer from "./../screen/QuestionAnswer";
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
            buzzed: [],
        }
    }

    joinRoom() {
        fetch(CONFIG.API_URL + 'room/quizz/' + this.state.quizz.id)
            .then((response) => response.json())
            .then((room) => {
                if (room.length === 0) {
                    setTimeout(() => {
                        this.joinRoom();
                    }, 1000);
                    return;
                }
                
                const conn = new WebSocket(CONFIG.SERVER_URL);
                conn.onopen = (e) => {
                    conn.send(`joinRoom|${room[0].id}|screen`);
                }
                conn.onmessage = (e) => {
                    console.log(e.data);
                    switch(e.data) {
                        // Question
                        case "startQuestion": this.setState({ playing: true }); break;
                        case "pauseQuestion": this.setState({ playing: false }); break;
                        case "nextQuestion":  this.handleNext(); break;

                        // Room
                        case "quitRoom": this.state.update.close(); this.props.history.push("/home"); break;

                        // Team
                        case "acceptBuzzQuestion":
                            this.setState({ buzzed: [], time: this.state.quizz.questions[this.state.room.step].time, playing: false });
                            this.handleScore();
                            break;
                        case "cancelBuzzQuestion":
                            const buzzed = this.state.buzzed.splice(1, this.state.buzzed.length);
                            this.setState({ buzzed: buzzed, playing: buzzed.length === 0 });
                            break;
                        default:
                            if (e.data.indexOf("buzzQuestion") >= 0) {
                                this.setState({ buzzed: this.state.buzzed.concat(e.data.split('|')[1]) });
                            }
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
        let time = this.state.time;
        if (this.state.playing && this.state.quizz.questions[this.state.room.step].time > this.state.time)
            time += 1;

        // Set timer color
        const limit = (time * 100) / this.state.quizz.questions[this.state.room.step].time;
        let color = "";
        if (limit < 50)
            color = "info";
        else if (limit < 75)
            color = "warning";
        else
            color = "danger";

        this.setState({
            time: limit > 100? this.state.quizz.questions[this.state.room.step].time : time,
            color: color,
            playing: limit < 100
        });

        // Time limit
        if (limit >= 100) {
            this.state.update.send(`stopQuestion|${this.state.room.id}`);
            this.handleScore();
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
                    players_old: this.state.players == null? null: this.state.players,
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
        if (this.state.loading) return (<div><Loading /></div>);

        // Display score
        if (this.state.display_step >= 2) {
            return (
                <div>
                    <Score 
                        players={this.state.players}
                        playersOld={this.state.players_old}
                        step={parseInt(this.state.room.step, 10)}
                        quizzLength={this.state.quizz.questions.length}
                        displayStep={this.state.display_step}
                        />
                </div>
            );
        }

        // Display Question & Answers
        return (
            <div>
                <QuestionAnswer
                    question={this.state.quizz.questions[this.state.room.step]}
                    displayStep={this.state.display_step}
                    quizzType={this.state.quizz.type}
                    time={this.state.time}
                    color={this.state.color}
                    buzzed={this.state.buzzed.length > 0}
                    buzzName={this.state.buzzed[0]}
                    handleText={this.handleText}
                    />
            </div>
        );
    }
}
export default Screen;