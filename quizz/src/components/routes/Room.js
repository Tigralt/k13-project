import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col } from 'reactstrap';

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
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Input type="text" name="name" placeholder="Nom du quizz" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" name="password" placeholder="Mot de passe" />
                            </FormGroup>
                            <Button>Rejoindre</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Room;