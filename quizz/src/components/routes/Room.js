import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactLoading from 'react-loading';
import { formURLEncode } from './../../utils/Utils.js';

class Room extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuit = this.handleQuit.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleNext = this.handleNext.bind(this);

        if ('id' in this.props.match.params) { // Joining room
            const id = this.props.match.params.id;

            fetch('http://quizz.k13-project.com/api/quizz/' + id + "/nested")
                .then((response) => response.json())
                .then((quizz) => {
                    if (quizz === false)
                        return this.props.history.push("/join-room");

                    this.setState({ quizz: quizz });
                    
                    fetch('http://quizz.k13-project.com/api/room/quizz/' + id)
                        .then((response) => response.json())
                        .then((room) => {
                            const session = JSON.parse(localStorage.getItem("session"));
                            const owner = session.id == quizz.player;

                            if (room.length == 0 && !owner) 
                                return this.props.history.push("/join-room");
                            else if (room.length == 0 && owner) {
                                return fetch('http://quizz.k13-project.com/api/room/', {
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
            playing: false,
            end: false,
            quizz: null,
            update: null
        };
    }

    updateRoom(id) {
        fetch('http://quizz.k13-project.com/api/room/' + id)
            .then((response) => response.json())
            .then((room) => {
                this.setState({
                    room: room
                });
            });
    }

    handleQuit(event) {
        if (window.confirm("Voulez vous vraiment quitter le quizz ?")) {
            this.setState({ loading: true });
            fetch('http://quizz.k13-project.com/api/room/' + this.state.room.id, {method: "DELETE"})
                .then((response) => response.json())
                .then((responseJson) => {
                    this.props.history.push("/home");
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loading()
        const data = new FormData(event.target);

        fetch('http://quizz.k13-project.com/api/quizz/name/' + data.get("name"))
            .then((response) => response.json())
            .then((quizz) => {
                if (quizz.length == 0)
                    return this.props.finished();

                this.props.history.push("/room/" + quizz[0].id);
                this.props.finished();
            });
    }

    handleStart(event) {
        fetch('http://quizz.k13-project.com/api/room/' + this.state.room.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                "is_playing": 1
            })
        }).then((response) => {
            if (this.state.room.step+1 >= this.state.quizz.questions.length) {
                clearInterval(this.state.update);
                this.setState({ end: true });
            }
        });
    }

    handleNext(event) {
        fetch('http://quizz.k13-project.com/api/room/' + this.state.room.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                "step": parseInt(this.state.room.step) + 1
            })
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button color="success" size="lg" block disabled={this.state.room.is_playing == 1 || this.state.end} onClick={this.handleStart}>Démarrer la question</Button>
                            </Col>
                        </Row>
                        <Row className="pt-4">
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button size="lg" block onClick={this.handleNext} disabled={this.state.room.step+1 >= this.state.quizz.questions.length}>Question suivante</Button>
                            </Col>
                        </Row>

                        <Row className="pt-4">
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button color="danger" size="lg" block onClick={this.handleQuit}>Arrêter le quizz</Button>
                            </Col>
                        </Row>
                    </div>
                )
            }

            return (
                <div>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            Joined
                        </Col>
                    </Row>
                </div>
            )
        }

        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
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