import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './stylesheets/inventory.css';
import AddInventoryItem from './addInventory.component.js';
import EditInventoryItem from './editInventory.component.js';


const InventoryItem = props => ( 
    /* inventory card for each inventory item, which displays the inventory ingredient name and image. When clicked on,
    the inventory item can be edited (the name, quantity, expiration date). In addition, thers an x icon which, when clicked triggers
    the ingredients deletion*/
    <div className="card" style={{width: 18 + 'rem'}}  >
      <h5 className="card-title ingredient-name">{props.item.IngredientName} <span className="ingredient-delete"><a href="#" onClick={() => { props.deleteInventoryItem(props.item._id) }}><i className="fas fa-window-close"></i></a></span></h5>
      <div  className="inventoryItem" onClick={(e) => props.editInventoryItem(e, props.item._id)}>
        <img className="card-img-top" src={props.item.ingredientImage} alt={props.item.IngredientName}/>
        <div className="ingredient card-body" >
          <div className="card-text">
            <p>
              {props.item.inventoryIngredientQuantity} {props.item.unit}
            </p>
            <p>
              {props.item.inventoryIngredientExpiration}
            </p>
          </div>
        </div>
      </div>
    </div>
  )


export default class InventoryList extends Component {
  /*
    InventoryList stores a list of inventory ingredients that the user has 
    Each InventoryItem can be edited and removed. In addition, inventory ingredients can be added 
    with the button add ingredient   
  */
    constructor(props) {
        super(props);

        this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.editInventoryItem = this.editInventoryItem.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.state = {
          inventory: [],
          token: Cookies.get('token'), // the token is to verify user login
          isEmptyState: true,
          isAddItemState: false,      //controls add item modal popup
          isEditItemState: false,     //controls edit item modal popup
          editKey: null               //specifies the inventory ID that is getting edited
        }
    }

    componentDidMount(){
        let config = {
          withCredentials: true
        }
        axios.get('http://localhost:5000/api/inventory/me', config)   //calls the backend for the inventory list 
                                                                      //(returns the information needed to display inventory items) 
            .then(response => {
                if(response.data.length > 0){
                  this.setState({
                    inventory: response.data    //sets the inventory space               
                  })
                  console.log(this.state.inventory);
                }

              }).catch(error => {
                console.log(error);
            });
    }


    deleteInventoryItem(id) { //deletes the inventory item from the users inventory list upon execution
      let headers = {
        'x-access-token': this.state.token    //adds the users token to the get request (to be verified by Auth.jsx middleware)  
      };
      axios.delete('http://localhost:5000/api/inventory/' + id, {headers: headers, data:null}).then(res => console.log(res.data));
        this.setState({
          inventory: this.state.inventory.filter(el => el._id !== id) //additional code the remove the item from the frontend UI (updates are not caught in realtime)
        })
    }

    editInventoryItem(e, id){ //edit inventory item from the users inventory upon click of a given inventory item card
      this.setState({
        editKey: id,
      }, () => {
        console.log("editKey ==", this.state.editKey);
        this.toggleEdit();
      });
    }

    toggleEdit() {    //opens and closes the edit item modal popup
      this.setState({
        isEditItemState: !this.state.isEditItemState
      });
    }

    inventoryList() { //  generates the inventory list front-end based off the inventory list stored in the components state  
        return this.state.inventory.map(item => {
          return (
          <div className = "col-4-md">
            <InventoryItem item={item} editInventoryItem = {this.editInventoryItem} deleteInventoryItem={this.deleteInventoryItem} key={item._id}/>
          </div>
          );
        })
    }

    triggerAddItemState = () => { //  opens and closes the add item modal popup 
      this.setState({
        ...this.state,
        isEmptyState: false,
        isAddItemState: true
      })
    }

    render (){
        return(
        <div>
        <h3>Inventory</h3>
        <div className="container">
          <div className = "row">
              { this.inventoryList() }
          </div>

          <div>
            <AddInventoryItem />
          </div>
          {this.state.isEditItemState && <EditInventoryItem toggle={this.toggleEdit} id={this.state.editKey}/>}
        </div>
      </div>
        )
    }
}