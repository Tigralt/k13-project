import React, { Component } from 'react';
import { Row, Col, Alert } from 'reactstrap';
import PlayerScore from "./PlayerScore";

class Score extends Component {
    render() {
        var display = ["er"];
        for (let i=0; i<this.props.players.length; i++)
            display.push("ème");
        const final = this.props.step+1 >= this.props.quizzLength? "final": "";

        return (
            <div>
                <Row>
                    <Col xs="12">
                        <h1 className="text-center">Tableau des scores {final}</h1>
                    </Col>
                </Row>
                <Row>
                    {this.props.players.map((player, index) =>
                    <Col xs="6">
                        <Alert color="dark" className="d-flex" style={{ lineHeight: "48px" }}>
                            <big className="flex-fill text-left" style={{fontSize:"48px"}}>
                                {index+1}{display[index]}
                            </big>
                            <div style={{ fontSize: "24px" }} className="text-center flex-fill">{player.name}</div>
                            <PlayerScore score={parseInt(player.score, 10)} old={this.props.playersOld === null?0:parseInt(this.props.playersOld[index].score, 10)} step={this.props.displayStep-2}/>
                        </Alert>
                    </Col>
                    )}
                </Row>
            </div>
        );
    }
}
export default Score;