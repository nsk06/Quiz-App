import React, { Component } from 'react';
import './Users.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Questions from './question';
class Quizzes extends Component {
  constructor(props) {
    super(props);
    this.goto = ""
    this.state = {
      data: [],
      myst: "",
      count : 0,
      quev:false,
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
        // alert(this.props.id)
      var url = 'http://127.0.0.1:8080/quiz/' + this.props.id
    //   alert(url)
    const request = new Request(url);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }
  changemy(event) {
    this.state.my = event.target.value;
  }

  render() {
    if (JSON.parse(localStorage.getItem("authentication")) === true)
    {
        if(this.state.quev === false)
        {
    return (
        <Router>
      <div className="App">
      <div>
        <header className="App-header">
          <h1 className="App-title">Quizzes</h1>
        </header>
        <table className="table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Play</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map((item, key) => {
               return (
                  <tr key = {key}>
                      <td>{item.quizname}</td>
                      <td><Link to={`/question/${item.id}`} onClick={() => {this.state.myst += `${item.id}`;this.setState({quev: true});}}>Play</Link></td>
                  </tr>
                )
             })}
          </tbody>
       </table>
      </div>
      <Switch>
            <Route path='/question/:id' exact component={Questions} />
        </Switch>
        </div>              
            </Router>
    );
            }
            else
            {
                return(
                    <Questions id={this.state.myst}/>
                )
            }
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

export default Quizzes;
