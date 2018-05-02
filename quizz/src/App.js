import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Content from './components/Content';

class App extends Component {
    render() {
        return (
            <div>
                <Navigation />
                <Content />
            </div>
        );
    }
}

export default App;
