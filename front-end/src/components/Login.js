import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import './Signup.css';
function validate(email, password) {
  const errors = [];
  if (email.length < 5) {
    errors.push("Email should be at least 5 charcters long");
  }
  if (email.split('').filter(x => x === '@').length !== 1) {
    errors.push("Email should contain a @");
  }
  if (email.indexOf('.') === -1) {
    errors.push("Email should contain at least one dot");
  }

  if (password.length < 6) {
    errors.push("Password should be at least 6 characters long");
  }

  return errors;
}
class Login extends Component {
  constructor()   {
    super();
    this.state = {
      formData: {
        email: "",
        password: "",
      },
      submitted: 0,
      redirect : false,
      errors: [],
    }
    this.handleEChange = this.handleEChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit (event) {
      event.preventDefault();
      const { email, password } = this.state.formData;
      const errors = validate(email, password);
      const {submitted,redirect} = this.state
      if (errors.length > 0) {
        this.setState({ errors });
        return;
      }
    fetch('http://localhost:8080/login', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
   .then(response => {
        if(this.state.formData.email === "nonidh.singh@gmail.com")
        {
          localStorage.setItem("admin",JSON.stringify(true))
        }
        localStorage.setItem("authentication",JSON.stringify(true));
        localStorage.setItem("email",this.state.formData.email)
        this.setState({redirect: true});
        localStorage.setItem("redirect",true)
        setTimeout(() => { window.location.reload(); }, 10); 
        if(response.status < 200 && response.status > 300)
        {
          alert("yoo")
          this.props.userHasAuthenticated(true);
          this.setState({submitted: 1});
          localStorage.setItem("submitted",1)
          
          ;
          // localStorage.setItem(password,this.state.formData.password)
        }
      }).catch(response => {
        // alert("exists");
             alert("Wrong Credentials")
       });

  }
  handleEChange(event) {
    this.state.formData.email = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }

  render() {
    const { redirect } = this.state;
    const { errors } = this.state;
    const { submitted } = this.state
    if (redirect) {
      //alert("bye");
      return <Redirect to='/profile'/>;
    }
    if (JSON.parse(localStorage.getItem("authentication")) === false || localStorage.getItem("authentication")===null)
    {
    return (
   
    <div>
      <form onSubmit={this.handleSubmit}>
      {errors.map(error => (
      <p key={error}>Error: {error}</p>
      ))} 
      { this.state.errors = []}
      <div className="App">
        <div className="App-header">
          <div className="App-title">
            <h1>Login</h1>
          </div>
    
          <div className="formContainer">
            <div className="form-group">
              <input type="text" className="form-control" placeholder="E-Mail" value={this.state.email} onChange={this.handleEChange}/>
              <label>Email</label>
            </div>
    
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handlePChange}/>
              <label>Password</label>
            </div>

            <div>
              {/* <input type="submit" className="btn btn-primary btn-large btn-block"/> <br/> */}
              <button type="submit" className="btn btn-default">Login</button>
              <a href="/register">New User?</a>
              <br/>
            </div>
            <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>
          <br>
          </br>
          <div class="g-signin2" data-onsuccess="onSignIn"></div>
          </div>

        </div>
        </div>
    </form>
    </div>
    
);
      }
      else{
        return (
          <Redirect to='/profile/'></Redirect>
        )
      }
  }
}

export default Login;
