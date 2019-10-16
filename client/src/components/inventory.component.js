import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const InventoryItem = props => (
    <tr>
      <td>{props.item.IngredientName}</td>
      <td>{props.item.inventoryIngredientQuantity}</td>
      <td>{props.item.inventoryIngredientExpiration.substring(0,10)}</td>
      <td>
        <Link to={"/edit/"+props.item._id}>edit</Link> | <a href="#" onClick={() => { props.deleteInventoryItem(props.item._id) }}>delete</a>
      </td>
    </tr>
  )


export default class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {inventory: []}
    }

    componentDidMount(){
        let config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
        axios.get('http://localhost:5000/api/inventory/me', config)
            .then(response => {
                console.log("here!!!\n");
                console.log(response);
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
          return <InventoryItem item={item} deleteInventoryItem={this.deleteInventoryItem} key={item._id}/>;
        })
    }

    render (){
        return(
        <div>
        <h3>Logged Item</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Expires</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            { this.inventoryList() }
          </tbody>
        </table>
      </div>
        )
    }
}