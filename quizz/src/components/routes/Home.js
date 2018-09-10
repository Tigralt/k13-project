import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';
import faTv from '@fortawesome/fontawesome-free-solid/faTv';
import { Row, Col, Button, Table, ButtonGroup } from 'reactstrap';
import CONFIG from './../../utils/Config.js';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = { quizz: null };
        this.session = JSON.parse(localStorage.getItem('session'));
        this.getQuizzes(this.session.id);
        this.handleDelete = this.handleDelete.bind(this);
    }

    getQuizzes(id) {
        fetch(CONFIG.API_URL + 'quizz/player/' + id)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ quizz: responseJson });
            });
    }

    handleDelete(id) {
        this.props.loading();
        fetch(CONFIG.API_URL + 'quizz/' + id, { method: 'DELETE' })
            .then(response => response.json())
            .then(responseJson => {
                this.props.finished();
            });
    }

    render() {
        if (this.session.username == null) window.location = '/';

        var rendering = [];
        rendering.push(
            <div>
                <Row>
                    <Col sm="12" className="text-center mb-4">
                        <h1>Bonjour {this.session.username}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col
                        sm="12"
                        md={{ size: 6, offset: 3 }}
                        className="text-center"
                    >
                        <Button
                            tag={Link}
                            to="/join-room"
                            color="primary"
                            size="lg"
                            block
                        >
                            Rejoindre un quizz
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col
                        sm="12"
                        md={{ size: 6, offset: 3 }}
                        className="text-center pt-3"
                    >
                        <Button
                            tag={Link}
                            to="/create-quizz"
                            color="secondary"
                            size="lg"
                            block
                        >
                            Créer un quizz
                        </Button>
                    </Col>
                </Row>
            </div>
        );

        if (this.state.quizz != null)
            rendering.push(
                <div>
                    <Row>
                        <Col
                            sm="12"
                            md={{ size: 6, offset: 3 }}
                            className="pt-4"
                        >
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Quizz</th>
                                        <th width="1%">Actions</th>
                                    </tr>
                                    {this.state.quizz.map((quizz, key) => (
                                        <tr key={quizz.id}>
                                            <td className="align-middle">
                                                {quizz.name}
                                            </td>
                                            <td>
                                                <ButtonGroup size="sm">
                                                    <Button
                                                        tag={Link}
                                                        to={
                                                            '/screen/' +
                                                            quizz.id
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTv}
                                                        />
                                                    </Button>
                                                    <Button
                                                        tag={Link}
                                                        to={'/room/' + quizz.id}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlay}
                                                        />
                                                    </Button>
                                                    <Button
                                                        tag={Link}
                                                        to={'/edit/' + quizz.id}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                        />
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            this.handleDelete(
                                                                quizz.id
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </thead>
                            </Table>
                        </Col>
                    </Row>
                </div>
            );

        return rendering;
    }
}
export default Home;
