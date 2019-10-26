import React, { Component, useState, setShow } from 'react';
import './stylesheets/inventory.css';
import {Button, Modal} from 'react-bootstrap';

export default class AddInventoryItem extends Component{
    constructor(props) {
        super(props);

        this.toggle  = this.toggle.bind(this);
        this.state = {
          modal: false
        }
    }    

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
    }
    
    render(){
        return(
            <>
            <Button variant="primary" onClick={this.toggle}>
              Launch demo modal
            </Button>
      
            <Modal show={this.state.modal} onHide={this.toggle} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.toggle}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.toggle}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
    }
}
