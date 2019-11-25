import React, { Component } from 'react';
import './stylesheets/inventory.css';
import {Button, Modal, Form} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import Cookies from 'js-cookie';
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from './autocomplete.component';
//component for user to select a recipe they used in order for the ingredients used
//to be deducted from the user's inventory
export default class UseRecipe extends Component{
    constructor(props) {
        super(props);

        this.toggle  = this.toggle.bind(this);
        this.displayIngredientForm = this.displayIngredientForm.bind(this);
        this.displayDangerAlert = this.displayDangerAlert.bind(this);
        this.displaySuccessAlert = this.displaySuccessAlert.bind(this);
        this.onChangeIngredient = this.onChangeIngredient.bind(this);
        this.onChangeUnit = this.onChangeUnit.bind(this);
        this.onChangeAddDate = this.onChangeAddDate.bind(this);
        this.onChangeExpiresDate = this.onChangeExpiresDate.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.displayMissedIngredients = this.displayMissedIngredients.bind(this);
        this.EditInventoryItem = this.EditInventoryItem.bind(this);
        this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {
            token: Cookies.get('token'),
            modal: false,
            ingredients: [],
            unitList: ['g', 'kg', 'lbs', 'oz', 'cups', 'ml', 'l', 'tsps', 'tbsps', 'qt', 'bunch', 'rip', 'scoops', 'leaves', 'drops', 'sheets', 'slices', 'inches', 'stalks', 'sticks', 
            'strips', 'sprigs', 'dashes', 'pinches'],
            unit: new String(),
            override: false,
            errorAlert: [],
            successAlert: []
        }
    }    

    async onSubmit(e){
        var recipebody = {
            ingredients: this.state.ingredients,
            override: this.state.override
        }
        let headers = {
            'x-access-token': this.state.token 
        };
        axios.post('http://localhost:5000/api/recipe/useRecipe/' + this.props.id, recipebody, {headers: headers}).then(async (res) => {
            console.log(res.data)
            for(var i = 0; i < res.data.length; i++){
                
                if(res.data[i].success === false){
                    var alerts = this.state.errorAlert;
                    alerts.push(res.data[i].msg);
                    this.setState({
                        errorAlert: alerts
                    })
                    break;
                } else{
                    var alerts = this.state.successAlert;
                    if(res.data[i].remove === false){

                        await this.EditInventoryItem(res.data[i].ingredient, res.data[i].newQuantity)
                        
                        alerts.push(res.data[i].msg);
                        this.setState({
                            successAlert: alerts
                        })
                    }else{
                        await this.deleteInventoryItem(res.data[i].ingredient._id)
                        alerts.push(res.data[i].msg);
                        this.setState({
                            successAlert: alerts
                        })
                    }
                }
            } 
        });

        this.toggle();
        //window.location = "/inventory";
    }

    deleteInventoryItem(id) { //deletes the inventory item from the users inventory list upon execution
        let headers = {
          'x-access-token': this.state.token    //adds the users token to the get request (to be verified by Auth.jsx middleware)  
        };
        axios.delete('http://localhost:5000/api/inventory/' + id, {headers: headers, data:null}).then(res => console.log(res.data));
      }

    EditInventoryItem(ingredient, quantity){ 
        const inventoryItem = {
            name: ingredient.IngredientName,
            from: ingredient.inventoryIngredientAdded,
            expires: ingredient.inventoryIngredientExpiration,
            quantity: quantity,
            unit: ingredient.unit
        }
        console.log(inventoryItem);
        let headers = {
            'x-access-token': this.state.token 
        };
        axios.post('http://localhost:5000/api/inventory/update/' + ingredient._id, inventoryItem, {headers: headers}).then(
          res => {
            console.log(res.data);
            this.toggle();
            //window.location = "/inventory";
          }).catch (err => {
              console.log(err);
          });

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
        }, () => {
            console.log(this.state.ingredients);
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

    displaySuccessAlert(){
        return this.state.successAlert.map(item => {
            return (
                <div class="alert alert-success" role="alert">
                    {item}
                </div> 
            )
        })
    }
    displayDangerAlert(){
        return this.state.errorAlert.map(item => {
            return (
                <div class="alert alert-danger" role="alert">
                    {item}
                </div> 
            )
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
            {this.displaySuccessAlert()}
            {this.displayDangerAlert()}
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
