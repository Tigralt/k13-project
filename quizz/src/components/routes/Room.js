import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Loading from '../Loading';
import Player from '../room/Player';
import Controller from '../room/Controller';
import JoinRoom from '../room/JoinRoom';
import { formURLEncode } from './../../utils/Utils.js';
import CONFIG from './../../utils/Config.js';

class Room extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuit = this.handleQuit.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleChoice = this.handleChoice.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.handleBuzz = this.handleBuzz.bind(this);
        this.handleScoreBuzz = this.handleScoreBuzz.bind(this);
        this.handleAcceptBuzz = this.handleAcceptBuzz.bind(this);
        this.handleCancelBuzz = this.handleCancelBuzz.bind(this);
        this.updateRoom = this.updateRoom.bind(this);

        if ('id' in this.props.match.params) {
            // Joining room
            const id = this.props.match.params.id;

            fetch(CONFIG.API_URL + 'quizz/' + id + '/nested')
                .then(response => response.json())
                .then(quizz => {
                    if (quizz === false)
                        return this.props.history.push('/join-room');

                    this.setState({ quizz: quizz });

                    fetch(CONFIG.API_URL + 'room/quizz/' + id)
                        .then(response => response.json())
                        .then(room => {
                            const session = JSON.parse(
                                localStorage.getItem('session')
                            );
                            const owner = session.id === quizz.player;

                            if (room.length === 0 && !owner)
                                return this.props.history.push('/join-room');
                            else if (room.length === 0 && owner) {
                                return fetch(CONFIG.API_URL + 'room/', {
                                    method: 'POST',
                                    headers: {
                                        Accept:
                                            'application/x-www-form-urlencoded',
                                        'Content-Type':
                                            'application/x-www-form-urlencoded',
                                    },
                                    body: formURLEncode({
                                        password: session.username,
                                        quizz: quizz.id,
                                    }),
                                })
                                    .then(response => response.json())
                                    .then(room => {
                                        this.setState(
                                            {
                                                room: room,
                                                owner: owner,
                                                loading: false,
                                            },
                                            () => {
                                                this.updateRoom();
                                            }
                                        );
                                    });
                            }

                            room = room[0];

                            if (!owner) this.joinRoom(room.id);

                            this.setState(
                                {
                                    room: room,
                                    owner: owner,
                                    loading: false,
                                },
                                () => {
                                    this.updateRoom();
                                }
                            );
                        });
                });
        }

        this.state = {
            room: null,
            owner: false,
            loading: 'id' in this.props.match.params,
            playing: false,
            scoring: false,
            end: false,
            quizz: null,
            update: null,
            buzzed: [],
            selected: [],
            confirmed: false,
        };
    }

    joinRoom(id) {
        const session = JSON.parse(localStorage.getItem('session'));
        fetch(CONFIG.API_URL + 'player/' + session.id, {
            method: 'PUT',
            headers: {
                Accept: 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                score: 0,
                room: id,
            }),
        });
    }

    updateRoom() {
        const socket = openSocket(CONFIG.SERVER_URL);
        socket.emit(
            'joinRoom',
            this.state.room.id,
            this.state.owner ? 'controller' : 'player'
        );

        socket.on('quitRoom', () => {
            this.state.update.close();
            this.props.history.push('/home');
        });

        socket.on('startQuestion', () => {
            this.setState({ playing: true });
        });

        socket.on('pauseQuestion', () => {
            this.setState({ playing: false });
        });

        socket.on('stopQuestion', () => {
            this.setState({ playing: false });
        });

        socket.on('nextQuestion', () => {
            this.setState({
                playing: false,
                confirmed: false,
                selected: [],
            });
        });

        socket.on('buzzQuestion', player => {
            this.setState({ buzzed: this.state.buzzed.concat(player) });
        });

        this.setState({
            update: socket,
        });
    }

    handleQuit(event) {
        if (window.confirm('Voulez vous vraiment quitter le quizz ?')) {
            this.setState({ loading: true });
            fetch(CONFIG.API_URL + 'room/' + this.state.room.id, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(responseJson => {
                    this.state.update.emit(
                        'quitRoom',
                        this.state.room.id,
                        this.state.owner ? 'controller' : 'player'
                    );
                    this.state.update.close();
                    this.props.history.push('/home');
                });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loading();
        const name = document.getElementsByName('name')[0].value;

        fetch(CONFIG.API_URL + 'quizz/name/' + name)
            .then(response => response.json())
            .then(quizz => {
                if (quizz.length === 0) return this.props.finished();

                this.props.history.push('/room/' + quizz[0].id);
                this.props.finished();
            });
    }

    handleStart(event) {
        this.state.update.emit('startQuestion', this.state.room.id);
        this.setState({ playing: true });
    }

    handleNext(event) {
        fetch(CONFIG.API_URL + 'room/' + this.state.room.id, {
            method: 'PUT',
            headers: {
                Accept: 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formURLEncode({
                step: parseInt(this.state.room.step, 10) + 1,
            }),
        })
            .then(response => response.json())
            .then(room => {
                this.state.update.emit('nextQuestion', this.state.room.id);
                this.setState({
                    room: room,
                    playing: false,
                });
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
        if (this.state.selected.length === 0) return;

        this.setState({ confirmed: true });
        const session = JSON.parse(localStorage.getItem('session'));

        fetch(CONFIG.API_URL + 'player/' + session.id)
            .then(response => response.json())
            .then(player => {
                fetch(CONFIG.API_URL + 'player/' + player.id, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formURLEncode({
                        score: this.handleScore(player),
                    }),
                });
            });
    }

    handleScore(player) {
        var score = 0;
        for (let selected of this.state.selected) {
            let points = parseInt(
                this.state.quizz.questions[this.state.room.step].answers[
                    selected
                ].points,
                10
            );
            if (points <= 0) {
                score = 0;
                break;
            } else score += points;
        }

        return score + parseInt(player.score, 10);
    }

    handleBuzz() {
        const session = JSON.parse(localStorage.getItem('session'));
        this.state.update.emit(
            'playerBuzzQuestion',
            this.state.room.id,
            session.username
        );
        this.setState({ confirmed: true });
    }

    handleScoreBuzz() {
        this.setState({ scoring: true });
    }

    handleAcceptBuzz(event) {
        event.preventDefault();

        let score = document.getElementsByName('score')[0].value;
        fetch(CONFIG.API_URL + 'player/name/' + this.state.buzzed[0])
            .then(response => response.json())
            .then(players => {
                if (players.length === 0) return;
                const player = players[0];

                fetch(CONFIG.API_URL + 'player/' + player.id, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formURLEncode({
                        score: parseInt(player.score, 10) + parseInt(score, 10),
                    }),
                }).then(() => {
                    this.state.update.emit(
                        'acceptBuzzQuestion',
                        this.state.room.id
                    );
                    this.setState({ scoring: false, buzzed: [] });
                });
            });
    }

    handleCancelBuzz() {
        this.state.update.emit('cancelBuzzQuestion', this.state.room.id);
        this.setState({
            buzzed: this.state.buzzed.splice(1, this.state.buzzed.length),
        });
    }

    render() {
        if (this.state.loading)
            return (
                <div>
                    <Loading />
                </div>
            );

        if (this.state.room !== null) {
            // Owner control panel
            if (this.state.owner) {
                return (
                    <div>
                        <Controller
                            buzzed={this.state.buzzed.length > 0}
                            name={this.state.buzzed[0]}
                            scoring={this.state.scoring}
                            playing={this.state.playing}
                            step={parseInt(this.state.room.step, 10)}
                            quizzLength={this.state.quizz.questions.length}
                            handleStart={this.handleStart}
                            handleNext={this.handleNext}
                            handleQuit={this.handleQuit}
                            handleAcceptBuzz={this.handleAcceptBuzz}
                            handleScoreBuzz={this.handleScoreBuzz}
                            handleCancelBuzz={this.handleCancelBuzz}
                        />
                    </div>
                );
            }

            return (
                <div>
                    <Player
                        handleChoice={this.handleChoice}
                        handleConfirm={this.handleConfirm}
                        handleBuzz={this.handleBuzz}
                        selected={this.state.selected}
                        confirmed={this.state.confirmed}
                        playing={this.state.playing}
                        quizz={this.state.quizz.type}
                    />
                </div>
            );
        }

        // Join room form
        return (
            <div>
                <JoinRoom handleSubmit={this.handleSubmit} />
            </div>
        );
    }
}
export default Room;
