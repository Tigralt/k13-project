import React, { Component } from 'react';

class PlayerScore extends Component {
    render() {
        switch (this.props.step) {
            case 0:
                var className = 'flex-fill text-right ';
                var score = '+0';

                if (this.props.score > this.props.old) {
                    className += 'text-success';
                    score = '+' + (this.props.score - this.props.old);
                } else if (this.props.score < this.props.old) {
                    className += 'text-danger';
                    score = this.props.score - this.props.old;
                }

                return (
                    <big className={className} style={{ fontSize: '36px' }}>
                        {score} pt
                    </big>
                );

            default:
                return (
                    <big
                        className="flex-fill text-right"
                        style={{ fontSize: '36px' }}
                    >
                        {this.props.score} pt
                    </big>
                );
        }
    }
}
export default PlayerScore;
