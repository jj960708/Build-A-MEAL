import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecipeItem = props => (
    <div className="card" style={{width: 18 + 'rem'}}>
      <img src={props.item.image} alt={props.item.title}/>
      <div className="card-body">
        <h5 className="card-title">{props.item.title}</h5>
        
          <p>
            {props.item.readyInMinutes}
          </p>
      </div>
    </div>

  )


export default class recipeList extends Component {
    constructor(props) {
        super(props);

        //this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {recipe: []}
    }

    componentDidMount(){
        
        axios.get('http://localhost:5000/api/recipe/test')
            .then(response => {
                if(response.data.length > 0){
                  this.setState({
                    recipe: response.data
                  })
                  console.log(response.data);
                }
                return;

              }).catch(error => {
                console.log(error);
            });
    }

    recipeList() {
      return this.state.recipe.map(item => {
        return (
        <div className = "col-4-md">
          <RecipeItem item={item}  key={item.id} />
        </div>
        );
      })
    }

    render (){
        return(
        <div>
        <h3>Recipes</h3>
        <div className="container">
          <div className = "row">
              { this.recipeList() }
          </div>
        </div>
      </div>
        )
    }
}