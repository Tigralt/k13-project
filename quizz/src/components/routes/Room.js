import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";
import ReactLoading from 'react-loading';
import { formURLEncode } from './../../utils/Utils.js';
import API_URL from './../../utils/Config.js';

class Room extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuit = this.handleQuit.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleChoice = this.handleChoice.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.updateRoom = this.updateRoom.bind(this);

        if ('id' in this.props.match.params) { // Joining room
            const id = this.props.match.params.id;

            fetch(API_URL + 'quizz/' + id + "/nested")
                .then((response) => response.json())
                .then((quizz) => {
                    if (quizz === false)
                        return this.props.history.push("/join-room");

                    this.setState({ quizz: quizz });
                    
                    fetch(API_URL + 'room/quizz/' + id)
                        .then((response) => response.json())
                        .then((room) => {
                            const session = JSON.parse(localStorage.getItem("session"));
                            const owner = (session.id === quizz.player);

                            if (room.length === 0 && !owner) 
                                return this.props.history.push("/join-room");
                            else if (room.length === 0 && owner) {
                                return fetch(API_URL + 'room/', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/x-www-form-urlencoded',
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                        body: formURLEncode({
                                            "password": session.username,
                                            "quizz": quizz.id
                                        })
                                    }).then((response) => response.json())
                                        .then((room) => {
                                            this.setState({
                                                room: room,
                                                owner: owner,
                                                loading: false
                                            }, () => {
                                                setInterval(() => { this.updateRoom(this.state.room.id); }, 500);
                                            });
                                        });
                            }

                            room = room[0];
                            
                            if (!owner)
                                this.joinRoom(room.id);

                            this.setState({
                                room: room,
                                owner: owner,
                                loading: false
                            }, () => {
                                this.setState({
                                    update: setInterval(() => { this.updateRoom(this.state.room.id); }, 500)
                                });
                            });
                        });
                });
        }

        this.state = {
            room: null,
            owner: false,
            loading: 'id' in this.props.match.params,
            end: false,
            quizz: null,
            update: null,
            selected: [],
            confirmed: false
        };
    }

    joinRoom(id) {
        const session = JSON.parse(localStorage.getItem("session"));
        fetch(API_URL + 'player/' + session.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                "score": 0,
                "room": id
            })
        })
    }

    updateRoom(id) {
        fetch(API_URL + 'room/' + id)
            .then((response) => response.json())
            .then((room) => {
                if (room === false) {
                    clearInterval(this.state.update);
                    return this.props.history.push("/home");
                }

                this.handleUpdate(room);
                this.setState({
                    room: room
                });
            });
    }

    handleQuit(event) {
        if (window.confirm("Voulez vous vraiment quitter le quizz ?")) {
            this.setState({ loading: true });
            fetch(API_URL + 'room/' + this.state.room.id, {method: "DELETE"})
                .then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/home");
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loading()
        const name = document.getElementsByName("name")[0].value;

        fetch(API_URL + 'quizz/name/' + name)
            .then((response) => response.json())
            .then((quizz) => {
                if (quizz.length === 0)
                    return this.props.finished();

                this.props.history.push("/room/" + quizz[0].id);
                this.props.finished();
            });
    }

    handleStart(event) {
        fetch(API_URL + 'room/' + this.state.room.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                "is_playing": 1
            })
        }).then((response) => {
            if (parseInt(this.state.room.step, 10)+1 >= this.state.quizz.questions.length) {
                clearInterval(this.state.update);
                this.setState({ end: true });
            }
        });
    }

    handleNext(event) {
        fetch(API_URL + 'room/' + this.state.room.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                "step": parseInt(this.state.room.step, 10) + 1
            })
        });
    }

    handleChoice(selected) {
        const index = this.state.selected.indexOf(selected);
        if (index < 0) {
            this.state.selected.push(selected);
        } else {
            this.state.selected.splice(index, 1);
        }
        this.setState({ selected: [...this.state.selected] });
    }

    handleConfirm(event) {
        if (this.state.selected.length === 0)
            return;
        
        this.setState({ confirmed: true });
        const session = JSON.parse(localStorage.getItem("session"));

        fetch(API_URL + 'player/' + session.id)
            .then((response) => response.json())
            .then((player) => {
                fetch(API_URL + 'player/' + player.id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formURLEncode({
                        "score": this.handleScore(player)
                    })
                });
            });
    }

    handleUpdate(room) {
        if (parseInt(room.step, 10) > parseInt(this.state.room.step, 10)) { // Next step
            this.setState({
                confirmed: false,
                selected: []
            });
        }
    }

    handleScore(player) {
        var score = 0;
        for(let selected of this.state.selected) {
            let points = parseInt(this.state.quizz.questions[this.state.room.step].answers[selected].points, 10);
            if (points <= 0) {
                score = 0;
                break;
            } else
                score += points;
        }

        return score + parseInt(player.score, 10);
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Row>
                        <Col xs="12" md={{ size: 6, offset: 3 }}>
                            <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                        </Col>
                    </Row>
                </div>
            )
        }

        if (this.state.room !== null) {
            if (this.state.owner) {
                return (
                    <div>
                        <Row>
                            <Col xs="12" md={{ size: 6, offset: 3 }}>
                                <Button color="success" size="lg" block disabled={this.state.room.is_playing === "1" || this.state.end} onClick={this.handleStart}>Démarrer la question</Button>
                            </Col>
                        </Row>
                        <Row className="pt-4">
                            <Col xs="12" md={{ size: 6, offset: 3 }}>
                                <Button size="lg" block onClick={this.handleNext} disabled={parseInt(this.state.room.step, 10)+1 >= this.state.quizz.questions.length}>Question suivante</Button>
                            </Col>
                        </Row>

                        <Row className="pt-4">
                            <Col xs="12" md={{ size: 6, offset: 3 }}>
                                <Button color="danger" size="lg" block onClick={this.handleQuit}>Arrêter le quizz</Button>
                            </Col>
                        </Row>
                    </div>
                )
            }

            return (
                <div>
                    <Row className="pt-4 pb-4">
                        <Col xs="6">
                            <Button color="info" size="lg" block style={{ fontSize: "48px" }} onClick={() => this.handleChoice(0)} active={this.state.selected.includes(0)} disabled={this.state.confirmed || this.state.room.is_playing === "0"} outline={this.state.room.is_playing === "1"}>A</Button>
                        </Col>
                        <Col xs="6">
                            <Button color="success" size="lg" block style={{ fontSize: "48px" }} onClick={() => this.handleChoice(2)} active={this.state.selected.includes(2)} disabled={this.state.confirmed || this.state.room.is_playing === "0"} outline={this.state.room.is_playing === "1"}>C</Button>
                        </Col>
                    </Row>
                    <Row className="pt-1 pb-4">
                        <Col xs="6">
                            <Button color="danger" size="lg" block style={{ fontSize: "48px" }} onClick={() => this.handleChoice(1)} active={this.state.selected.includes(1)} disabled={this.state.confirmed || this.state.room.is_playing === "0"} outline={this.state.room.is_playing === "1"}>B</Button>
                        </Col>
                        <Col xs="6">
                            <Button color="warning" size="lg" block style={{ fontSize: "48px" }} onClick={() => this.handleChoice(3)} active={this.state.selected.includes(3)} disabled={this.state.confirmed || this.state.room.is_playing === "0"} outline={this.state.room.is_playing === "1"}>D</Button>
                        </Col>
                    </Row>
                    <Row className="pt-4 pb-4">
                        <Col xs="12">
                            <Button color="secondary" size="lg" block style={{ fontSize: "48px" }} onClick={this.handleConfirm} disabled={this.state.confirmed}>Valider</Button>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <div>
                <Row>
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.handleSubmit} className="clearfix">
                            <FormGroup>
                                <Input type="text" name="name" placeholder="Nom du quizz" />
                            </FormGroup>
                            {/* <FormGroup>
                                <Input type="password" name="password" placeholder="Mot de passe" />
                            </FormGroup> */}
                            <Button className="float-left">Rejoindre</Button>
                            <Button tag={Link} to="/home" className="float-right">Retour</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Room;