import React, { Component } from 'react';
import './Users.css';

class ViewUsers extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/users');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  render() {
    if (JSON.parse(localStorage.getItem("authentication")) === true)
    {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">View All People</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
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
                    <h3>Please login to view</h3>
                </div>
            )
        }
  }
}

export default ViewUsers;
