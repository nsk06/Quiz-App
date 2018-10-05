import React, { Component } from 'react';
import './Users.css';

class lboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
      var url = 'http://127.0.0.1:8080/leaders'
    const request = new Request(url);
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
          <h1 className="App-title">View Leaders</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
              console.log(item)
               return (
                  <tr key = {key}>
                      <td>{item.Myname}</td>
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
                    <h3>Please login to view</h3>
                </div>
            )
        }
  }
}

export default lboard;
