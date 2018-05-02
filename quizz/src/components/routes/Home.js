import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Button
} from 'reactstrap';

class Home extends Component {
    render() {
        const session = JSON.parse(localStorage.getItem("session"));
        const now = (new Date()).getTime();

        if (session.username == null)
            window.location = "/";

        console.log(session);

        return (
            <div>
                <Row>
                    <Col sm="12" className="text-center mb-4">
                        <h1>Bonjour { session.username }</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 6, offset: 3 }} className="text-center">
                        <Link to="/join-room"><Button color="primary" size="lg" block>Rejoindre une salle</Button></Link>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 6, offset: 3 }} className="text-center pt-3">
                        <Link to="/create-quizz"><Button color="secondary" size="lg" block>Créer un quizz</Button></Link>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Home;