import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Room extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            room: null
        };
    }

    handleSubmit(event) {
        event.preventDefault();


    }

    render() {
        return (
            <div>
                <Row>
                    <Col sm={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.handleSubmit} className="clearfix">
                            <FormGroup>
                                <Input type="text" name="name" placeholder="Nom du quizz" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" name="password" placeholder="Mot de passe" />
                            </FormGroup>
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