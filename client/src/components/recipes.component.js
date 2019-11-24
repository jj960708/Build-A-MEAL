import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GetRecipeItem from './recipe.component.js';
import { isThisMonth } from 'date-fns/esm';
import {Button, Modal, Form} from 'react-bootstrap';
import Select from 'react-select';

const RecipeItem = props => (
    <Link to={"/GetRecipe/"+props.item.id}>
      <div className="card" style={{width: 18 + 'rem'}}  >
        <img src={props.item.image} alt={props.item.title}/>
        <div className="card-body">
          <h5 className="card-title">{props.item.title}</h5>
          
            <p>
              {props.item.readyInMinutes}
            </p>
        </div>
      </div>
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
          { value: 'African', label: 'African' }
        ];
        this.mealoptions = [
          { value: 'breakfirst', label: 'breakfirst' },
          { value: 'lunch', label: 'lunch' },
          { value: 'dinner', label: 'dinner' }
        ];
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

    async sortByPreptime(){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          if(response.data){
            console.log(response.data.cuisines);
            var promise = response.data;
            tmp.push(promise);
            
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

    async Cusisinetype(value){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          
          if(response.data && response.data.cuisines===value){
            var promise = response.data;
            tmp.push(promise);
            
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

    
    async MealType(value){
      var tmp = [];
      var i;
      
      for (i in this.state.recipe){
        await axios.get(`http://localhost:5000/api/recipe/findrecipe/${this.state.recipe[i].id}`)
        .then(response => {
          
          if(response.data && response.data.dishTypes.includes(value)){
            var promise = response.data;
            tmp.push(promise);
            
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
        <div>
         
        <h3>Recipes</h3>
        <div className="row" >
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
        <div className="container" >
          <div className = "row">
              { this.recipeList() }
          </div>
        </div>
        
      </div>
        )
    }
}
