import React, { Component } from 'react';
import logo from './logo.png';
import './homepage.css'
class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to QuizMaster</h1>
          <h3>Do you have it in yourself what it takes to become a Champ!</h3>
          <img src={logo} alt="logo" className="img-fluid" />
        </header>
      </div>
    );
  }
}

export default Home;
