import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Row, Col, Button, Table, ButtonGroup, Form, FormGroup, Input } from 'reactstrap';
import { formURLEncode } from './../../utils/Utils.js';

class Edit extends Component {
    constructor(props) {
        super(props);

        this.findQuestion = this.findQuestion.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.state = {
            quizz: null,
            edit: null
        };

        fetch('http://quizz.k13-project.com/api/quizz/' + this.props.match.params.id + '/nested')
            .then((response) => response.json())
            .then((responseJson) => { this.setState({ quizz: responseJson }); });
    }

    handleDelete(id) {
        this.props.loading();
        fetch('http://quizz.k13-project.com/api/question/' + id, { method: 'DELETE'})
            .then((response) => response.json())
            .then((responseJson) => { this.props.finished(); });
    }

    findQuestion(id) {
        var question = null;

        for(var index in this.state.quizz.questions) {
            let q = this.state.quizz.questions[index];
            if (q.id == id) {
                question = q;
                break;
            }
        }

        return question;
    }

    handleEdit(id) {
        const question = this.findQuestion(id);

        this.setState({ edit: id }, () => {
            if (id < 0)
                return;

            const form = document.getElementById("quizzform");
            const inputs = form.getElementsByTagName("INPUT");

            inputs[0].setAttribute("value", question.text);
            for(let i=0; i<4; i++) {
                inputs[i*2+1].setAttribute("value", question.answers[i].text);
                inputs[(i+1)*2].setAttribute("value", question.answers[i].points);
            }
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.loading();
        const data = new FormData(event.target);
        const _question = (this.state.edit > 0)? this.findQuestion(this.state.edit): null;
        const values = [];

        for (let value of data.values())
            values.push(value);

        let question = {
            text: values[0],
            quizz: this.state.quizz.id
        };

        if (this.state.edit > 0) {
            fetch('http://quizz.k13-project.com/api/question/' + this.state.edit, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formURLEncode(question)
            }).then((response) => response.json())
                .then((question) => {
                    for (let i=0; i<4; i++) {
                        let answer = {
                            text: values[1+i*2],
                            points: values[(i+1)*2],
                            question: question.id
                        };
                        
                        fetch('http://quizz.k13-project.com/api/answer/' + _question.answers[i].id, {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/x-www-form-urlencoded',
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: formURLEncode(answer)
                        }).then(() => { if (i >= 3) this.props.finished(); });
                    }
                });
        } else {
            fetch('http://quizz.k13-project.com/api/question/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formURLEncode(question)
            }).then((response) => response.json())
                .then((question) => {
                    for (let i=0; i<4; i++) {
                        let answer = {
                            text: values[1+i*2],
                            points: values[(i+1)*2],
                            question: question.id
                        };
                        
                        fetch('http://quizz.k13-project.com/api/answer/', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/x-www-form-urlencoded',
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: formURLEncode(answer)
                        }).then(() => { if (i >= 3) this.props.finished(); });
                    }
                });
        }

        this.setState({ edit: null });
    }

    render() {
        if (this.state.quizz != null) {
            if (this.state.edit != null)
                return (
                    <div>
                        <Row>
                            <Col sm={{ size: 6, offset: 3 }}>
                                <h1>{ this.state.quizz.name }</h1>
                                <Form onSubmit={this.handleSubmit} id="quizzform">
                                    <FormGroup>
                                        <Input type="text" name="question[name]" placeholder="Question" />
                                    </FormGroup>

                                    <hr />
                                    <FormGroup>
                                        <Input type="text" name="answer[name][0]" placeholder="Réponse" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="number" name="answer[points][0]" placeholder="Nombre de points" min="0"/>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup>
                                        <Input type="text" name="answer[name][1]" placeholder="Réponse" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="number" name="answer[points][1]" placeholder="Nombre de points" min="0"/>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup>
                                        <Input type="text" name="answer[name][2]" placeholder="Réponse" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="number" name="answer[points][2]" placeholder="Nombre de points" min="0"/>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup>
                                        <Input type="text" name="answer[name][3]" placeholder="Réponse" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="number" name="answer[points][3]" placeholder="Nombre de points" min="0"/>
                                    </FormGroup>
                                    
                                    <Button color="success">Sauvegarder</Button>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                );

            return (
                <div>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }} className="pt-4">
                            <h1>{ this.state.quizz.name }</h1>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th width="1%">Actions</th>
                                    </tr>
                                    {this.state.quizz.questions.map((question) =>
                                        <tr>
                                            <td className="align-middle">{question.text}</td>
                                            <td>
                                                <ButtonGroup size="sm">
                                                    <Button onClick={() => this.handleEdit(question.id)}><FontAwesomeIcon icon={faEdit} /></Button>
                                                    <Button onClick={() => this.handleDelete(question.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    )}
                                </thead>
                            </Table>

                            <Button onClick={() => this.handleEdit(-1)} color="secondary">Ajouter une question</Button>
                        </Col>
                    </Row>
                </div>
            )
        }

        return (<div></div>)
    }
}
export default Edit;