import React, { Component } from 'react';
import axios from 'axios';

const m_b_10 = {
  marginBottom: '40px',
};


//component for user login
export default class Login extends Component{
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        email : '',
        password : '',
        success : true,
        errmsg: ""
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
  //bring logged in user to his/her inventory
  onSubmit(e){
    e.preventDefault();

    const login_info = {
        email: this.state.email,
        password: this.state.password,
    }
    console.log(login_info);

    axios.post('/api/auth', login_info)
        .then(res => {
          console.log(res.data)
          window.location = "/inventory";
        }).catch(err =>{
          this.setState({
            success: false,
            errmsg: err.response.data.errors[0].msg  
          })
          console.log(err);
    });
  
  }
  render(){
    return(
        <div className="container-fluid d-flex flex-column align-items-center">
          <div className = "card" style={{width: 30 + 'rem'}}>
            <div className="card-body">
                <h3 style={m_b_10} className="card-title">Login</h3>
                {!this.state.success && 
                <div class="alert alert-danger" role="alert">
                    {this.state.errmsg}
                </div> 
                }
                <form className="form-group" onSubmit={this.onSubmit}>
                  <input style={m_b_10} className="form-control" type="email" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.onChangeEmail} required/>
                  <input style={m_b_10} className="form-control" type="password" placeholder="Enter Password" name="psw" value={this.state.password} onChange={this.onChangePassword} required/>
                  <button className="btn btn-primary" classtype="submit">Login</button>

                </form>
            </div>
          </div>
        </div>  
      );
  }
}