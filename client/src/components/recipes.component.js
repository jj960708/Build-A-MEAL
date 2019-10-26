import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecipeItem = props => (
    <div className="card" style={{width: 18 + 'rem'}}>
      <img className="card-img-top" src={props.item.recipeImage} alt={props.item.recipeName}/>
      <div className="card-body">
        <h5 className="card-title">{props.item.recipeName}</h5>
        <div className="card-text">
          <p>
            {props.item.recipePrepTime}
          </p>
        </div>
      </div>
    </div>

  )


export default class RecipeList extends Component {
    constructor(props) {
        super(props);

        //this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {recipe: []}
    }

    componentDidMount(){
        let config = {
          withCredentials: true
        }
        axios.get('http://localhost:5000/api/recipe/me', config)
            .then(response => {
                if(response.data.length > 0){
                  this.setState({
                    recipe: response.data
                  })
                }

              }).catch(error => {
                console.log(error);
            });
    }

    recipeList() {
        return this.state.inventory.map(item => {
          return (
          <div className = "col-4-md">
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
              { this.recipeList() }
          </div>
        </div>
      </div>
        )
    }
}