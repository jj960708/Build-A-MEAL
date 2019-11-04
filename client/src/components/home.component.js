import React from 'react';
import './stylesheets/home.css';
import background from "./images/sunny.jpg"

export default class Login extends React.Component{
  render(){
    return(
    <div id="home">
      <div id="Splash" className= "d-flex flex-column align-items-center">
        <h1>Build-A-Meal</h1>
        <h2>Find recipes faster, smarter, and easier.</h2>
        <a className="navbar-text" href="/signup" style={{color: "white"}}>Start Now</a>
      </div>
    {/* <!-- Search Bar !--> */}

      <div id="Info">
      <div className ="row">
        <div className="col-6">
          <img src={background} alt="The same stock photo of sunshine."/>
        </div>
        <div className="col-6 d-flex flex-column">
          <h2>What is Build-A-Meal?</h2>
            <p>Responsive web design is about creating web sites which automatically adjust themselves to look good on all devices, from small phones to large desktops.</p>
            <a className="navbar-text" href="/signup" style={{color: "white"}}>Get Started Now</a>
        </div>
      </div>
      </div>
    </div>

    );
  }
}