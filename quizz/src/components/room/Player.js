import React, { Component } from 'react';
import DefaultAnswer from './answer/DefaultAnswer.js';
import TeamAnswer from './answer/TeamAnswer.js';

class Player extends Component {
    render() {
        switch (this.props.quizz) {
            case 'single':
                // Single player answer panel
                return (
                    <div>
                        <DefaultAnswer
                            handleChoice={this.props.handleChoice}
                            handleConfirm={this.props.handleConfirm}
                            selected={this.props.selected}
                            confirmed={this.props.confirmed}
                            playing={this.props.playing}
                        />
                    </div>
                );

            case 'team':
                return (
                    <div>
                        <TeamAnswer
                            handleBuzz={this.props.handleBuzz}
                            confirmed={this.props.confirmed}
                            playing={this.props.playing}
                        />
                    </div>
                );

            default:
                return <div>Erreur de type de quizz</div>;
        }
    }
}
export default Player;
