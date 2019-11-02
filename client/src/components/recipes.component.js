import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GetRecipeItem from './recipe.component.js';

const RecipeItem = props => (
    <div className="card" style={{width: 18 + 'rem'}} onClick={(e) => props.getRecipeItem(e, props.item.id)} >
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
        this.getRecipeItem = this.getRecipeItem.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        //this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.state = {
          ingredients: [],
          recipe: [],
          recipeID:null,
          singleRecipe: [],
          display : false
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
                  ingredients: response.data
                }, () => {
                  console.log("ingredients", this.state.ingredients);
                  axios.post('http://localhost:5000/api/recipe/', {ingredientsList: this.state.ingredients})
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
                });
              }

            }).catch(error => {
              console.log(error);
          });
    }
    getRecipeItem(e, id){
      this.setState({
        recipeID: id,
      }, () => {
        console.log("editKey ==", this.state.recipeID);
        this.toggleEdit();
      });
        
     
    }

    recipeList() {
      return this.state.recipe.map(item => {
        return (
        <div className = "col-4-md">
          <RecipeItem item={item}  key={item.id} getRecipeItem = {this.getRecipeItem} />
        </div>
        );
      })
    }

    toggleEdit() {
      this.setState({
        display: !this.state.display
      });
    }


    render (){
        return(
        <div>
        {this.state.display && <GetRecipeItem toggle={this.toggleEdit} id={this.state.recipeID}/>}
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
