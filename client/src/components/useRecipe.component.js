import React, { Component } from 'react';
import './stylesheets/inventory.css';
import {Button, Modal, Form} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import Cookies from 'js-cookie';
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from './autocomplete.component';

export default class UseRecipe extends Component{
    constructor(props) {
        super(props);

        this.toggle  = this.toggle.bind(this);
        this.displayIngredientForm = this.displayIngredientForm.bind(this);
        this.onChangeIngredient = this.onChangeIngredient.bind(this);
        this.onChangeUnit = this.onChangeUnit.bind(this);
        this.onChangeAddDate = this.onChangeAddDate.bind(this);
        this.onChangeExpiresDate = this.onChangeExpiresDate.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.displayMissedIngredients = this.displayMissedIngredients.bind(this);
        this.state = {
            token: Cookies.get('token'),
            modal: false,
            ingredients: [],
            unitList: ['g', 'kg', 'lbs', 'oz', 'cups', 'ml', 'l', 'tsps', 'tbsps', 'qt', 'bunch', 'rip', 'scoops', 'leaves', 'drops', 'sheets', 'slices', 'inches', 'stalks', 'sticks', 
            'strips', 'sprigs', 'dashes', 'pinches'],
            unit: new String()
        }
    }    

    onSubmit(e){

        //alert(inventoryItem);

        let headers = {
            'x-access-token': this.state.token 
        };
        axios.post('http://localhost:5000/api/recipe/useRecipe/' + this.props.id, this.state.ingredients, {headers: headers}).then(res => console.log(res.data));
        this.toggle();
        //window.location = "/inventory";
    }

    componentWillReceiveProps(nextProps) {
        var ingredients = [];
        for(var i = 0; i < nextProps.usedIngredients.length; i++){
            var ingredient = {
                name: nextProps.usedIngredients[i].name,
                id: nextProps.usedIngredients[i].id,
                amount: nextProps.usedIngredients[i].amount,
                unit: nextProps.usedIngredients[i].unit,
                index: i
            }
            ingredients.push(ingredient);
        }
        this.setState({
            ingredients: ingredients
        });
    }

    onChangeUnit(unit, index){
        var ingredients = this.state.ingredients;
        ingredients[index].unit = unit;
        this.setState({
            ingredients: ingredients
        }, () => {
            console.log(this.state.ingredients);
        });
        

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

    onChangeQuantity(e, index){
        var ingredients = this.state.ingredients;;
        ingredients[index].amount = e.target.value;
        this.setState({
            ingredients: ingredients
        });
    }

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
    }

    displayIngredientForm(){
        return this.state.ingredients.map(item => {
            
            return (
                <div className="d-flex flex-row">
                <h4 className="recipe-item-name">{item.name}</h4>
                <div className="d-flex flex-row unit-info">
                <Form.Group>
                    <Form.Control className="quantity-field" type="number" onChange={(e) => this.onChangeQuantity(e, item.index)} value={item.amount}/>
                </Form.Group>
                    <Form.Group>
                    <Autocomplete
                        selected = {item.unit}
                        className ="form-control quantity-field"
                        suggestions={this.state.unitList}
                        onChange={(e) => this.onChangeUnit(e, item.index)} 
                    />
                </Form.Group>
                </div>
                </div>
            );
        })
    }

    displayMissedIngredients(){
        return this.props.missedIngredients.map(item => {
            return (
                <li className="">{item.name} ({item.amount} {item.unit})</li>
            );
        })
    }
    
    render(){
        return(
            <div>
            <Button variant="primary" onClick={this.toggle}>
              Use Recipe
            </Button>
      
            <Modal show={this.state.modal} onHide={this.toggle} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Use Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form>
                    {this.displayIngredientForm()}
                    
                    <h3 className="text-center">Missed Ingredients</h3>
                    <ul>
                    {this.displayMissedIngredients()}
                    </ul>
              </Form>
                

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.toggle}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.onSubmit}>
                  Use Recipe
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )
    }
}
