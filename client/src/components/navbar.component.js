import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//component for navigating through the app
export default class Navbar extends Component {
  
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Build A Meal</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li className="navbar-item">
          <Link to="/signup" className="nav-link">Sign up</Link>
          </li>
          <li className="navbar-item">
          <Link to="/inventory" className="nav-link">Inventory</Link>
          </li>
          <li className="navbar-item">
          <Link to="/recipe" className="nav-link">Recipe</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}