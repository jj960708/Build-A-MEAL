import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//component for navigating through the app
import './stylesheets/navbar.css';
import Cookies from 'js-cookie';
export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.state = {
      isLoggedIn: false
    }  
  }

  componentDidMount(){
    var token = Cookies.get('token'); // the token is to verify user login
    if(token){
      this.setState({
        isLoggedIn: true
      });
    }
  }

  logout(){
    Cookies.remove('token');
    window.location = "/"
  }

  render() {
    return (
      <nav className="navbar fixed-top navbar-light bg-light navbar-expand-lg">
        <Link to="/" className="navbar-brand">Build-A-Meal</Link>
        <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/inventory" className="nav-link">Inventory</Link>
          </li>
          <li className="navbar-item">
          <Link to="/recipe" className="nav-link">Recipe</Link>
          </li>
          {!this.state.isLoggedIn && 
            <>
            <li className="navbar-item">
            <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="navbar-item">
            <Link to="/signup" className="nav-link">Sign up</Link>
            </li>
            </>
          }
          { this.state.isLoggedIn &&
            <li className="navbar-item">
            <div onClick={(e) => this.logout()} className="nav-link">Logout</div>
            </li>
          }
        </ul>
        </div>
      </nav>
    );
  }
}