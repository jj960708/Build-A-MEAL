import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UseRecipe from './useRecipe.component.js';
const queryString = require('query-string');


const RecipeItem = props => (
    <div className="row">
    <div className="card" style={{width: 100 + '%', height: 10 + "rem"}}>
      <div className="card-body">
        {props.item.number != -1 && <h5 className="card-title">Step number {props.item.number}</h5>}
          <p>
            {props.item.step}
          </p>
      </div>
    </div>
    </div>

  )


export default class GetRecipeItem extends Component {
    constructor(props) {
        super(props);

        //this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
        this.toggleRecipe = this.toggleRecipe.bind(this);
        this.restoreState = this.restoreState.bind(this);
        this.state = {
          recipe:[],
          title: "",
          image: "",
          usedIngredients: [],
          unusedIngredients: [],
          missedIngredients: [],
          useRecipe: false
        }
        
    }
    
    async componentDidMount(){
        console.log(this.props.match.params.id);
        axios.get(`http://localhost:5000/api/recipe/find/${this.props.match.params.id}`)
            .then(response => {
                if(response.data){
                  console.log(response);
                  this.setState({
                    recipe: response.data[0].steps
                  })

                }
                    return console.log(response.data);

              }).catch(error => {
                this.setState({
                  recipe: [{
                    number:-1,
                    step:"RECIPE INSTUCTIONS NOT FOUND"
                  }] 
                });
                console.log(error);
            });
      await this.restoreState();
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
    
    
    restoreState(){
      var url = window.location.href
      var qstring_index = url.search("\\?");
      console.log("url == ",url);
      if(qstring_index !== -1){
          var qstring = url.slice(qstring_index + 1, url.length);
          var recipeInfo = JSON.parse(queryString.parse(qstring).info);
          var title = recipeInfo.title;
          var missedIngredients = recipeInfo.missedIngredients;    //parses out the query string in the response url into an object and returns the request parameter
          var image = recipeInfo.image;
          var unusedIngredients = recipeInfo.unusedIngredients;
          var usedIngredients = recipeInfo.usedIngredients;
          console.log(recipeInfo);
          //console.log(JSON.parse(radioRequestString));
          console.log("hereeee\n");
          this.setState({
            title: title,
            missedIngredients: missedIngredients,
            image: image,
            unusedIngredients: unusedIngredients,
            usedIngredients: usedIngredients
          }, () => {
            console.log(this.state);
          });
      }
      return new Promise(function(resolve, reject){
        resolve();
      });
  }

    toggleRecipe(){
      this.setState({
        useRecipe: !this.state.useRecipe
      })
    }

    render (){
        return(
        <div>
        <h3>Recipes Instruction</h3>
        <div className="container">
          <h1>{ this.state.title }</h1>
          <img className="" src={this.state.image} alt={this.state.title}/>
          <div className = "">
              { this.recipeList() }
          </div>
          <UseRecipe/>
        </div>
      </div>
        )
    }
}