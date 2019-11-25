import React from 'react';
import './stylesheets/home.css';
import background from "./images/sunny.jpg"
//home component to explain some info on the web app
export default class Login extends React.Component{
  render(){
    return(
    <div id="home">
      <div id="Splash" className= "d-flex flex-column align-items-center">
        <h1>Build-A-Meal</h1>
        <h2>Find recipes faster, smarter, and easier.</h2>
        <a className="navbar-text btn btn-primary" href="/signup" style={{color: "white", fontWeight: "bold", fontSize: 20}}>Start Now</a>
      </div>
    {/* <!-- Search Bar !--> */}

      <div id="Info">
        <div className ="row">
          <div className="col-6">
            <img src={background} alt="The same stock photo of sunshine."/>
          </div>
          <div className="col-6 d-flex flex-column">
            <h2>What is Build-A-Meal?</h2>
              <p>Build-A-Meal provides an easy and clean web application that allows users to maximize their efficiency in the kitchen by pairing ingredients to recipes catered to their personal preferences.</p>
              <a className="navbar-text" href="/signup" style={{color: "white"}}>Get Started Now</a>
          </div>
        </div>
      </div>

      

    </div>

    );
  }
}