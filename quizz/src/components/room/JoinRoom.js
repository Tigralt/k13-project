import React, { Component } from 'react';
import { Button, Row, Col, Form, FormGroup, Input } from 'reactstrap';
import { Link } from "react-router-dom";

class JoinRoom extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.props.handleSubmit} className="clearfix">
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
        );
    }
}
export default JoinRoom;