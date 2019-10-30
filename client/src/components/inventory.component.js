import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './stylesheets/inventory.css';
import AddInventoryItem from './addInventory.component.js';
import EditInventoryItem from './editInventory.component.js';

const InventoryItem = props => ( 
    <div className="card" style={{width: 18 + 'rem'}} onClick={(e) => props.editInventoryItem(e, props.item._id)} >
      <img className="card-img-top" src={props.item.ingredientImage} alt={props.item.IngredientName}/>
      <h5 className="card-title ingredient-name">{props.item.IngredientName} <span className="ingredient-delete"><a href="#" onClick={() => { props.deleteInventoryItem(props.item._id) }}><i className="fas fa-window-close"></i></a></span></h5>
      <div className="ingredient card-body">
        <div className="card-text">
          <p>
            {props.item.inventoryIngredientQuantity}
          </p>
          <p>
            {props.item.inventoryIngredientExpiration.substring(0,10)}
          </p>
        </div>
      </div>
    </div>
  )


export default class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.editInventoryItem = this.editInventoryItem.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.state = {
          inventory: [],
          token: Cookies.get('token'),
          isEmptyState: true,
          isAddItemState: false,
          isEditItemState: false,
          editKey: null
        }
    }

    componentDidMount(){
        let config = {
          withCredentials: true
        }
        axios.get('http://localhost:5000/api/inventory/me', config)
            .then(response => {
                if(response.data.length > 0){
                  this.setState({
                    inventory: response.data
                  })
                }

              }).catch(error => {
                console.log(error);
            });
    }


    deleteInventoryItem(id) {
      let headers = {
        'x-access-token': this.state.token 
      };
      axios.delete('http://localhost:5000/api/inventory/' + id, {headers: headers, data:null}).then(res => console.log(res.data));
        this.setState({
          inventory: this.state.inventory.filter(el => el._id !== id)
        })
    }

    editInventoryItem(e, id){
      this.setState({
        editKey: id,
      }, () => {
        console.log("editKey ==", this.state.editKey);
        this.toggleEdit();
      });
    }

    toggleEdit() {
      this.setState({
        isEditItemState: !this.state.isEditItemState
      });
    }

    inventoryList() {
        return this.state.inventory.map(item => {
          return (
          <div className = "col-4-md">
            <InventoryItem item={item} editInventoryItem = {this.editInventoryItem} deleteInventoryItem={this.deleteInventoryItem} key={item._id}/>
          </div>
          );
        })
    }

    triggerAddItemState = () => {
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