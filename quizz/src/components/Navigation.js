import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/">Kebabhoot</NavbarBrand>
                </Navbar>
            </div>
        );
    }
}

export default Navigation;