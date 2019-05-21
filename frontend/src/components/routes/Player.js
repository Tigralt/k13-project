import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { formURLEncode } from './../../utils/Utils.js';
import CONFIG from './../../utils/Config.js';

class Player extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.username = null;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loading();

        this.username = document.getElementsByName('name')[0].value;
        fetch(CONFIG.API_URL + 'player/')
            .then(response => response.json())
            .then(responseJson => {
                this.handleApi(responseJson);
            });
    }

    handleApi(players) {
        let player = null;
        for (var key in players) {
            if (this.username === players[key].name) {
                player = players[key];
                break;
            }
        }

        if (!player) {
            fetch(CONFIG.API_URL + 'player/', {
                method: 'POST',
                headers: {
                    Accept: 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formURLEncode({
                    name: this.username,
                }),
            })
                .then(response => response.json())
                .then(responseJson => {
                    this.loadSession(responseJson);
                });
        } else this.loadSession(player);
    }

    loadSession(player) {
        const session = {
            timeout: new Date().getTime() + 6 * 60 * 60 * 1000,
            username: player.name,
            id: player.id,
        };

        localStorage.setItem('session', JSON.stringify(session));

        this.props.history.push('/home');
        this.props.finished();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Nom d'utilisateur"
                                    maxLength="20"
                                />
                            </FormGroup>
                            <Button>Se connecter</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Player;
