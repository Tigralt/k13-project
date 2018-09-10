import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';

class Loading extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" md={{ size: 6, offset: 3 }}>
                        <ReactLoading type="spin" color="#333333" className="mx-auto"/>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Loading;