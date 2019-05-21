import React, { Component } from 'react';
import {
    Button,
    Row,
    Col,
    Jumbotron,
    Form,
    FormGroup,
    Input,
} from 'reactstrap';

class ScoringControl extends Component {
    render() {
        return (
            <div>
                <Row className="pt-4">
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Jumbotron>
                            <h1 className="text-center">{this.props.name}</h1>
                        </Jumbotron>
                    </Col>
                </Row>
                <Row className="pt-1">
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <Form onSubmit={this.props.handleAcceptBuzz}>
                            <FormGroup>
                                <Input
                                    placeholder="Score"
                                    type="number"
                                    name="score"
                                />
                            </FormGroup>
                            <Button>Valider</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default ScoringControl;
