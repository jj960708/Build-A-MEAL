import React, { Component } from 'react';
import axios from 'axios';

const m_b_10 = {
  marginBottom: '40px',
};



export default class Login extends Component{
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        email : '',
        password : '',
    }

  }

  onChangeEmail(e){
    this.setState({ //this needs to refer to the class
        email: e.target.value
    })    
  }

  onChangePassword(e){
      this.setState({
          password: e.target.value
      })    
  }

  onSubmit(e){
    e.preventDefault();

    const login_info = {
        email: this.state.email,
        password: this.state.password,
    }
    console.log(login_info);

    axios.post('/api/auth', login_info)
        .then(res => console.log(res.data)).catch(err =>{
          console.log(err);
        });

    //window.location = "/";
  }
  render(){
    return(
        <div className="container-fluid d-flex flex-column align-items-center">
            <div className = "card" style={{width: 30 + 'rem'}}>
            <div className="card-body">
                <h5 style={m_b_10} className="card-title">Login</h5>
                <form className="form-group" onSubmit={this.onSubmit}>
                  <input style={m_b_10} className="form-control" type="text" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.onChangeEmail} required/>
                  <input style={m_b_10} className="form-control" type="password" placeholder="Enter Password" name="psw" value={this.state.password} onChange={this.onChangePassword} required/>
                  <button className="btn btn-primary" classtype="submit">Login</button>
                  <label>
                    <input type="checkbox" checked="checked" name="remember"/> Remember me
                  </label>
                </form>
            </div>     
            </div>
        </div>  
        
      );
  }
}