import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import Login from "./components/login.component";
import Signup from "./components/signup.component";
import Register from "./components/register.component";
import Inventory from "./components/inventory.component";
import withAuth from './components/withAuth';
// import EditExercise from "./components/edit-exercise.component";
// import CreateExercise from "./components/create-exercise.component"; 
// import CreateUser from "./components/create-user.component";

function App() {
  return (
    <Router>
      <div className="">  
        <Navbar />
        <br />
        <Route path="/" exact component= {Home} />
        <Route path="/login" component= {Login} />
        <Route path="/signup" component= {Signup} />
        <Route path="/register" component= {Register} />
        <Route path="/inventory" component={withAuth(Inventory)} />
        <div className="container">
        </div>
      </div>
    </Router>
  );
}

export default App;
