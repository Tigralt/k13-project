import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { formURLEncode } from './../../utils/Utils.js';

class Player extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.username = null;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loading();

        const data = new FormData(event.target);
        this.username = data.get("name");

        fetch('http://quizz.k13-project.com/api/player/')
            .then((response) => response.json())
            .then((responseJson) => { this.handleApi(responseJson); });
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
            fetch('http://quizz.k13-project.com/api/player/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formURLEncode({
                    "name": this.username
                })
            }).then((response) => response.json())
                .then((responseJson) => { this.loadSession(responseJson); });
        }
        else
            this.loadSession(player);
    }

    loadSession(player) {
        const session = {
            "timeout": (new Date()).getTime() + 6 * 60 * 60 * 1000,
            "username": player.name,
            "id": player.id
        }

        localStorage.setItem("session", JSON.stringify(session));

        this.props.history.push("/home");
        this.props.finished();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Input type="text" name="name" placeholder="Nom d'utilisateur" />
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