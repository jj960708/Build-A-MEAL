import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const InventoryItem = props => (
    <div className="card" style={{width: 18 + 'rem'}}>
      <img className="card-img-top" src={props.item.ingredientImage} alt={props.item.IngredientName}/>
      <div className="card-body">
        <h5 className="card-title">{props.item.IngredientName}</h5>
        <div className="card-text">
          <p>
            {props.item.inventoryIngredientQuantity}
          </p>
          <p>
            {props.item.inventoryIngredientExpiration.substring(0,10)}
          </p>
        </div>
        <Link to={"/edit/"+props.item._id}>edit</Link> | <a href="#" onClick={() => { props.deleteInventoryItem(props.item._id) }}>delete</a>
      </div>
    </div>

  )


export default class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {inventory: []}
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
        axios.delete('http://localhost:5000/api/inventory/' + id)
            .then(res => console.log(res.data));
        this.setState({
            inventory: this.state.inventory.filter(el => el._id !== id)
        })
    }

    inventoryList() {
        return this.state.inventory.map(item => {
          return (
          <div className = "col-4-md">
            <InventoryItem item={item} deleteInventoryItem={this.deleteInventoryItem} key={item._id}/>
          </div>
          );
        })
    }

    render (){
        return(
        <div>
        <h3>Logged Item</h3>
        <div className="container">
          <div className = "row">
              { this.inventoryList() }
          </div>
        </div>
      </div>
        )
    }
}