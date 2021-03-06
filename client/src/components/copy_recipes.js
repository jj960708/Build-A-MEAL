import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GetRecipeItem from './recipe.component.js';
import { isThisMonth } from 'date-fns/esm';
import {Button, Modal, Form} from 'react-bootstrap';
import Select from 'react-select';
import './stylesheets/recipes.css';
const queryString = require('query-string');

var have_all_ingredients = {
  width: '18rem',
}

var notall_ingredients = {
  width: '18rem',
  border: '1 solid red',
}

const RecipeItem = props => (
  /*
    Generates RecipeItem card. Each recipe item card has the recipe name along with the image of the recipe
    When the recipe is clicked on, the page will redirect to display the recipe instructions.
  */
  <Link to={"/GetRecipe/"+props.item.id+"?"+props.info}>
    {this.props.missing_ingredients && <div className="card recipe-card" style={notall_ingredients}  >
      <img id="recipe-image" src={props.item.image} alt={props.item.title}/>
      <div className="card-body">
        <h5 className="card-title">{props.item.title}</h5>
        
          {/* <p>
            {props.item.readyInMinutes}
          </p> */}
      </div>
      
    </div>
    }
    {!this.props.missing_ingredients && <div className="card recipe-card" style={have_all_ingredients}  >
      <img id="recipe-image" src={props.item.image} alt={props.item.title}/>
      <div className="card-body">
        <h5 className="card-title">{props.item.title}</h5>
        
          {/* <p>
            {props.item.readyInMinutes}
          </p> */}
      </div>
      
    </div>
    }
    </Link> 
    

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
          selectedrecipe: [],
          recipeID:null,
          singleRecipe: [],
          display : false
        };
        this.cusineoptions = [
          { value: 'American', label: 'American' },
          { value: 'African', label: 'African' },
          { value: 'British', label: 'British' },
          { value: 'Chinese', label: 'Chinese' },
          { value: 'European', label: 'European' },
          { value: 'French', label: 'French' },
          { value: 'Cajun', label: 'Cajun' },
          { value: 'Greek', label: 'Greek' },
          { value: 'German', label: 'German' },
          { value: 'Indian', label: 'Indian' },
          { value: 'Irish', label: 'Irish' },
          { value: 'Italian', label: 'Italian' },
          { value: 'Japanese', label: 'Japanese' },
          { value: 'Jewish', label: 'Jewish' },
          { value: 'Korean', label: 'Korean' },
          { value: 'Latin American', label: 'Latin American' },
          { value: 'Mediterranean', label: 'Mediterranean' },
          { value: 'Mexican', label: 'Mexican' },
          { value: 'Middle Eastern', label: 'Middle Eastern' },
          { value: 'Nordic', label: 'Nordic' },
          { value: 'Southern', label: 'Southern' },
          { value: 'Spanish', label: 'Spanish' },
          { value: 'Thai', label: 'Thai' },
          { value: 'Vietnamese', label: 'Vietnamese' }

        ];
        this.mealoptions = [
          { value: 'breakfast', label: 'breakfast' },
          { value: 'lunch', label: 'lunch' },
          { value: 'dinner', label: 'dinner' },
          { value: 'side dish', label: 'side dish' }
        ];
    }

    componentDidMount(){
      let config = {
        withCredentials: true
      }
      axios.get('http://localhost:5000/api/inventory/me', config) //grabs the user's inventory to take in the user's ingredients list
          .then(response => {
              if(response.data.length > 0){
                this.setState({
                  ingredients: response.data
                }, () => {
                  console.log("ingredients", this.state.ingredients); //takes in the ingredients list and places the ingredients list into the body of the post request to recipe
                  axios.post('http://localhost:5000/api/recipe/', {ingredientsList: this.state.ingredients}) //grabs the top 15 recipes that are associated with the ingredients 
                                                                                                            //list generated from the previous axios request
                  .then(response => {
                      if(response.data.length > 0){
                        this.setState({
                          recipe: response.data,
                          selectedrecipe: response.data
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

    giveRecipeHeader(id){
      for(var i = 0; i < this.state.recipe.length; i++){
        if(this.state.recipe[i].id == id){
          return(JSON.stringify(this.state.recipe[i]));
        }
      }
    }

    recipeList() {
      return this.state.selectedrecipe.map(item => {
        var query = queryString.stringify({
          info:JSON.stringify(item), 
        });
        var missing_ingredients = false;
        if(item.missedIngredientCount > 0){
          missing_ingredients = true;
        }
        return (
        <div className = "col-4-md">
          <RecipeItem missing_ingredients = {true} info = {query} item={item}  key={item.id} getRecipeItem = {this.getRecipeItem} />
        </div>
        );
      })
    }

    toggleEdit() {
      this.setState({
        display: !this.state.display
      });
    }
    //allows user the option to sort the recipes by quickest prep time
    async sortByPreptime(){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          if(response.data){
            console.log(response.data.cuisines);
            var recipe_info = {...this.state.recipe[i], ...response.data};     
            tmp.push(recipe_info);
            
          }
          

        }).catch(error => {
          
          return console.log(error);
      });
      };
      tmp.sort((a,b)=>a.readyInMinutes - b.readyInMinutes)
      this.setState({
        selectedrecipe: tmp
      }

      );
      return console.log(tmp);
    }
    //allows the user to sort the recipes by their desired cuisine type
    async Cusisinetype(value){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          
          if(response.data && response.data.cuisines.includes(value)){
            var recipe_info = {...this.state.recipe[i], ...response.data};     
            tmp.push(recipe_info);
            
          }
          

        }).catch(error => {
          
          return console.log(error);
      });
      };
      this.setState({
        selectedrecipe: tmp
      }

      );
      return console.log(tmp);
    }

    //allows the user to sort the recipes based on meal type (breakfast, lunch, dinner, dessert)
    async MealType(value){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          
          if(response.data && response.data.dishTypes.includes(value)){
            var recipe_info = {...this.state.recipe[i], ...response.data};     
            tmp.push(recipe_info);
            
          }
          

        }).catch(error => {
          
          return console.log(error);
      });
      };
      this.setState({
        selectedrecipe: tmp
      }

      );
      return console.log(tmp);
    }

    render (){
       return(
        <div id="recipes" className="container d-flex flex-column align-items-center">
        <div id = "recipe-card" className="card"> 
        <div className= "card-header recipes-header"> <h1>Recipes</h1>
          <div className="row d-flex justify-content-center" >
          <Button variant="primary" onClick={(e)=> this.sortByPreptime()}>
                Prep Time
              </Button>
          <div style={{width: '200px'}}>
          <Select
                name="form-dept-select"
                
                onChange={(e)=> this.Cusisinetype(e.value)}
                options={this.cusineoptions}
            />
          </div>
          <div style={{width: '200px'}}>
          <Select
                name="form-dept-select"
                onChange={(e)=> this.MealType(e.value)}
                options={this.mealoptions}
                
            />
          </div>
          </div>
        </div>
        <div className="card-body">
        <div className="container" >
          <div className = "row d-flex justify-content-center">
              { this.recipeList() }
          </div>
        </div>
        </div>
       </div> 
      </div>
      )
    }
}

