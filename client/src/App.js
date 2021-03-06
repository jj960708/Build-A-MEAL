import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/navbar.component";
import Footer from "./components/footer.component";
import Home from "./components/home.component";
import Login from "./components/login.component";
import Signup from "./components/signup.component";
import Register from "./components/register.component";
import Inventory from "./components/inventory.component";
import withAuth from './components/withAuth';
import Recipe from './components/recipes.component.js';
import GetRecipe from './components/recipe.component.js';
import './components/stylesheets/app.css';
// import EditExercise from "./components/edit-exercise.component";
// import CreateExercise from "./components/create-exercise.component"; 
// import CreateUser from "./components/create-user.component";

function App() {
  return (
    <Router>
      <div className="background">  
        <Navbar /> 

        <Route path="/" exact component= {Home} />
        <Route path="/inventory" component={withAuth(Inventory)} />
        <div className="components">
        <Route path="/login" component= {Login} />
        <Route path="/signup" component= {Signup} />
        <Route path="/register" component= {Register} />
        <Route path="/recipe" component= {withAuth(Recipe)} />

        <Route path="/GetRecipe/:id" component={withAuth(GetRecipe)} />
        </div>
        <div className="container content">
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
