import React, { Component } from 'react';
// import ViewUsers from './users';
// import Genres from './genres';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
class Profile extends Component {
    constructor() {
        super();
        this.state = {
          data: []
        }
      }
      componentDidMount() {
        const request = new Request('http://127.0.0.1:8080/recent');
        fetch(request)
          .then(response => response.json())
            .then(data => this.setState({data: data}));
      }
    
    render () {
        if (JSON.parse(localStorage.getItem("authentication")) === true)
    {
        // window.location.reload()
        return (
            <div className = "App">
            <div>
                <h3>Welcome Back!</h3><br>
                </br>
                <h3>Here are Your recent attempts!</h3>
            </div>
            <table className="table-hover">
          <thead>
            <tr>
              <th>Quizname</th>
              <th>Your Score</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
              console.log(item)
            //   alert(item)
               return (
                  <tr key = {key}>
                      <td>{item.qname}</td>
                      <td>{item.fullscore}</td>
                  </tr>
                )
             })}
          </tbody>
       </table>
          </div>
        );
    }
    else
    {
        return (
            <div>
                <h3>You are not authenticated.Please login first</h3>
            </div>
        )
    }
    }
}
export default Profile;