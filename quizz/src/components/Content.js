import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactLoading from 'react-loading';
import {
    Container,
    Row,
    Col,
    Button
} from 'reactstrap';

import Player from './routes/Player';
import Home from './routes/Home';

class Content extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false }
        this.loading = this.loading.bind(this);
        this.finished = this.finished.bind(this);
    }

    loading() {
        this.setState({ loading: true });
    }

    finished() {
        this.setState({ loading: false });
    }

    render() {
        // Firewall
        const session = JSON.parse(localStorage.getItem("session"));
        const now = (new Date()).getTime();
        if (session == null || session.timeout < now) {
            localStorage.clear();
            window.location = "/";
        }

        if (this.state.loading)
            return (
                <div>
                    <Container className="pt-4">
                        <Row>
                            <Col sm={{ size: 6, offset: 3 }}>
                                <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );

        return (
            <div>
                <Container className="pt-4">
                    <Router>
                        <div>
                            <Route exact path="/" render={(props) => (<Player {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/home" render={(props) => (<Home {...props} loading={this.loading} finished={this.finished}/>)}/>
                        </div>
                    </Router>
                </Container>
            </div>
        );
    }
}

export default Content;