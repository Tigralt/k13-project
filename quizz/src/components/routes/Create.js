import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Row, Col, FormFeedback } from 'reactstrap';
import { formURLEncode } from './../../utils/Utils.js';

class Create extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.createQuizz = this.createQuizz.bind(this);
        this.session = JSON.parse(localStorage.getItem("session"));
        this.state = {
            quiz: null,
            invalid: false,
            step: 0,
            pagination: 0,
            questions: [],
            answers: []
        };
    }

    createQuizz(name) {
        fetch('http://quizz.k13-project.com/api/quizz/name/' + name)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length > 0) { // Already exists
                    this.validation(true);
                    return;
                }

                // Create it
                fetch('http://quizz.k13-project.com/api/quizz/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formURLEncode({
                        "name": name,
                        "player": this.session.id
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        this.setQuizz(responseJson);
                        this.nextStep();
                        document.getElementById("quizzform").reset();
                    });
            });
    }

    validation(value) { this.setState({ invalid: value }); }
    setQuizz(value) { this.setState({ quizz: value }); }
    nextStep() { this.setState({ step: this.state.step + 1 }); }
    prevStep() { this.setState({ step: this.state.step - 1 }); }
    pushQuestion(question) { this.setState({ question: this.state.questions.concat(question) }); }
    pushAnswer(answer) { this.setState({ answer: this.state.answers.concat(answer) }); }

    handleSubmit(event) {
        event.preventDefault();
        this.validation(false);
        const data = new FormData(event.target);

        switch (this.state.step) {
            case 0:
                this.createQuizz(data.get("name"));
                break;

            case 1:
                const values = [];
                for (let value of data.values())
                    values.push(value);
        
                this.addQuestionAndAnswer(values);
                this.props.history.push("/home");
                break;
        }
    }

    handleClick(event) {
        event.preventDefault();

        const form = document.getElementById("quizzform");
        const data = new FormData(form);

        const values = [];
        for (let value of data.values())
            values.push(value);

        this.addQuestionAndAnswer(values);
        form.reset();
    }

    addQuestionAndAnswer(values) {
        let question = {
            text: values[0],
            quizz: this.state.quizz.id
        };
        this.pushQuestion(question);

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
                    this.pushAnswer(answer);
                    
                    fetch('http://quizz.k13-project.com/api/answer/', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formURLEncode(answer)
                    });
                }
            });
    }

    render() {
        switch (this.state.step) {
            case 0:
                return (
                    <div>
                        <Row>
                            <Col sm={{ size: 6, offset: 3 }}>
                                <h2>Créer un quizz</h2>
                                <Form onSubmit={this.handleSubmit} id="quizzform">
                                    <FormGroup>
                                        <Input type="text" name="name" placeholder="Nom du quizz" invalid={this.state.invalid}/>
                                        <FormFeedback>Ce nom est déja pris !</FormFeedback>
                                    </FormGroup>
                                    <Button color="success">Suivant</Button>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                );

            case 1:
                return (
                    <div>
                        <Row>
                            <Col sm={{ size: 6, offset: 3 }}>
                                <h2>Créer un quizz</h2>
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
                                    
                                    <Button color="secondary" className="mr-2" onClick={this.handleClick}>Sauvegarder et ajouter une question</Button>
                                    <Button color="success">Terminer</Button>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                );
        }
    }
}
export default Create;