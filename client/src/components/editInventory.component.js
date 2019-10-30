import React, { Component } from 'react';
import './stylesheets/inventory.css';
import {Button, Modal, Form} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import Cookies from 'js-cookie';
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from './autocomplete.component';

export default class EditInventoryItem extends Component{
    constructor(props) {
        super(props);

        this.toggle  = this.props.toggle.bind(this);
        this.onChangeIngredient = this.onChangeIngredient.bind(this);
        this.onChangeUnit = this.onChangeUnit.bind(this);
        this.onChangeAddDate = this.onChangeAddDate.bind(this);
        this.onChangeExpiresDate = this.onChangeExpiresDate.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            token: Cookies.get('token'),
            modal: true,
            name: "",
            addDate: null,
            expires: null,
            quantity: null,
            ingredientList: ['egg whites', 'watermelon chunks'],
            unitList: ['g', 'kg', 'lbs', 'oz', 'cups', 'ml', 'l', 'tsps', 'tbsps', 'qt', 'bunch', 'rip', 'scoops', 'leaves', 'drops', 'sheets', 'slices', 'inches', 'stalks', 'sticks', 
            'strips', 'sprigs', 'dashes', 'pinches'],
            unit: null
        }
    }    

    componentDidMount() {
        let config = {
            withCredentials: true
        }
        axios.get('http://localhost:5000/api/inventory/inventoryIngredient/'+ this.props.id, config)
          .then(response => {
            this.setState({
              name: response.data.IngredientName,
              addDate: new Date(response.data.inventoryIngredientAdded),
              expires: new Date(response.data.inventoryIngredientExpiration),
              quantity: response.data.inventoryIngredientQuantity 
            },() => {
                console.log("added the inventory stuff!");
            });   
            
          })
          .catch(function (error) {
            console.log(error);
          })
        axios.get('http://localhost:5000/api/inventory/ingredientsList', config)
          .then(response => {
              console.log("response ==", response);
              if(response.data.ingredientsList.length > 0){
              this.setState({
                  ingredientList: response.data.ingredientsList
                });
              }
  
            }).catch(error => {
              console.log(error);
          });
    }

    onSubmit(e){  
        const inventoryItem = {
            name: this.state.name,
            from: this.state.addDate,
            expires: this.state.expires,
            quantity: this.state.quantity
        }
        console.log(inventoryItem);

        let headers = {
            'x-access-token': this.state.token 
        };
        axios.post('http://localhost:5000/api/inventory/update/' + this.props.id, inventoryItem, {headers: headers}).then(res => console.log(res.data));
        this.toggle();
        window.location = "/inventory";
    }

    onChangeUnit(unit){
        this.setState({ //this needs to refer to the class
            unit: unit
        })

    };

    onChangeIngredient(name){
        this.setState({ //this needs to refer to the class
            name: name
        })
        console.log(this.state.name);
    };
    
    onChangeAddDate(date){
        this.setState({
          addDate: date
        });
    };

    onChangeExpiresDate(date){
        this.setState({
          expires: date
        });
    };

    onChangeQuantity(e){
        this.setState({
            quantity: e.target.value
        });
    }

    
    render(){
        return(
            <Modal show={this.state.modal} onHide={this.toggle} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Food Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form>
                    <Form.Group>
                        <Form.Label>Ingredient Name</Form.Label>
                            <Autocomplete
                                className ="form-control"
                                selected={this.state.name}
                                suggestions={this.state.ingredientList} 
                                onChange={this.onChangeIngredient}
                                fetchSelected ={this.getName}
                            />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Date added</Form.Label>
                        <br></br>
                        <DatePicker
                            className="form-control"
                            selected={this.state.addDate}
                            onChange={this.onChangeAddDate}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expires</Form.Label>
                        <br></br>
                        <DatePicker
                            className ="form-control"
                            selected={this.state.expires}
                            onChange={this.onChangeExpiresDate}
                        />
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" onChange={this.onChangeQuantity} value={this.state.quantity}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    <Autocomplete
                        className ="form-control"
                        suggestions={this.state.unitList}
                        onChange={this.onChangeUnit} 
                    />
                    </Form.Group>
              </Form>
                

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.toggle}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.onSubmit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
        )
    }
}
