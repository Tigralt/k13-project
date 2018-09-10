import React, { Component } from 'react';
import ScoringControl from "./control/ScoringControl";
import BuzzControl from "./control/BuzzControl";
import QuizzControl from "./control/QuizzControl";

class Controller extends Component {
    render() {
        if (this.props.buzzed) { // Buzzer mgmt
            if (this.props.scoring) { // Give score to the buzzed team
                return (
                    <div>
                        <ScoringControl name={this.props.name} handleAcceptBuzz={this.props.handleAcceptBuzz}/>
                    </div>
                );
            }

            // Accept or refuse buzz answer
            return (
                <div>
                    <BuzzControl name={this.props.name} handleScoreBuzz={this.props.handleScoreBuzz} handleCancelBuzz={this.props.handleCancelBuzz}/>
                </div>
            )
            
        } else { // Quizz mgmt
            return (
                <div>
                    <QuizzControl playing={this.props.playing} step={this.props.step} quizzLength={this.props.quizzLength} handleStart={this.props.handleStart} handleNext={this.props.handleNext} handleQuit={this.props.handleQuit}/>
                </div>
            )
        }
    }
}
export default Controller;