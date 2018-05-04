import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactLoading from 'react-loading';
import { Container, Row, Col } from 'reactstrap';

import Player from './routes/Player';
import Home from './routes/Home';
import Room from './routes/Room';
import Create from './routes/Create';
import Edit from './routes/Edit';
import Screen from './routes/Screen';

class Content extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false }
        this.loading = this.loading.bind(this);
        this.finished = this.finished.bind(this);

        // Firewall
        this.session = JSON.parse(localStorage.getItem("session"));
        const now = (new Date()).getTime();
        const current = window.location.pathname;

        if (current !== "/" && (this.session == null || this.session.timeout < now)) {
            localStorage.clear();
            window.location = "/";
        }
    }

    loading() {
        this.setState({ loading: true });
    }

    finished() {
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading)
            return (
                <div>
                    <Container className="pt-4">
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            );

        return (
            <div>
                <Container className="pt-4 pb-4">
                    <Router>
                        <div>
                            <Route exact path="/" render={(props) => (<Player {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/home" render={(props) => (<Home {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/join-room" render={(props) => (<Room {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/create-quizz" render={(props) => (<Create {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/edit/:id" render={(props) => (<Edit {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/room/:id" render={(props) => (<Room {...props} loading={this.loading} finished={this.finished}/>)}/>
                            <Route path="/screen/:id" render={(props) => (<Screen {...props} loading={this.loading} finished={this.finished}/>)}/>
                        </div>
                    </Router>
                </Container>
            </div>
        );
    }
}
export default Content;