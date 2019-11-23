import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



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
        this.state = {recipe:[]}
        
    }
    
    componentDidMount(){
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
        <h3>Recipes Instruction</h3>
        <div className="container">
          <div className = "">
              { this.recipeList() }
          </div>
        </div>
      </div>
        )
    }
}