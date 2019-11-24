import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UseRecipe from './useRecipe.component.js';
import './stylesheets/recipe.css';
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
        this.displayIngredients = this.displayIngredients.bind(this);
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
        // axios.get(`http://localhost:5000/api/recipe/find/${this.props.match.params.id}`)
        //     .then(response => {
        //         if(response.data){
        //           console.log(response);
        //           this.setState({
        //             recipe: response.data[0].steps
        //           })

        //         }
        //             return console.log(response.data);

        //       }).catch(error => {
        //         this.setState({
        //           recipe: [{
        //             number:-1,
        //             step:"RECIPE INSTUCTIONS NOT FOUND"
        //           }] 
        //         });
        //         console.log(error);
        //     });
      await this.restoreState();
      console.log("restored state!");
      
    }

    displayIngredients(){
     var missedIngredients = this.state.missedIngredients.map(item => {
        return (
          <li>{item.name} ({item.amount} {item.unit})</li>
        );
      });
      var usedIngredients = this.state.usedIngredients.map(item=>{
        return (
          <li>{item.name}  ({item.amount} {item.unit})</li>
        );
      });
      var totalIngredients = missedIngredients;
      for(var i = 0; i < usedIngredients.length; i++ ){
        totalIngredients.push(usedIngredients[i]);
      }
      return totalIngredients;
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
        console.log("returning promise!");
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
        <div className>

        <div className="container d-flex flex-column align-items-center">
          <h1 class ="recipe-title">{ this.state.title }</h1>
          <img className="" src={this.state.image} alt={this.state.title}/>
          <div className = "">
              <div className = "recipe-ingredients">
                <h3>Ingredients</h3>
                { this.displayIngredients() }
              </div>
              {/* { this.recipeList() } */}
          </div>
          <UseRecipe missedIngredients={this.state.missedIngredients} usedIngredients={this.state.usedIngredients}/>
        </div>
      </div>
        )
    }
}