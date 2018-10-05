import React, { Component } from 'react';
import './Users.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Quizzes from './quiz';
import PropTypes from 'prop-types';
import Genboard from './genboard';
class Genres extends Component {
  constructor(props) {
    super(props)
    // this.goto = ""
    this.state = {
      data: [],
    my: " ",
    qv: false,
    bv: false,
    myvar: " ",
    }
    this.boardview = this.boardview.bind(this);
    // this.props.increment = 1
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/genres');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }
  changemy(event) {
    this.state.id = event.target.value;
  }
  boardview(e,x) {
        e.preventDefault()

  }
  render() {
    if (JSON.parse(localStorage.getItem("authentication")) === true)
    {
        if(this.state.qv === false && this.state.bv === false)
        {
    return (
      
      <Router>
          <div className="App">
        <div>
        <header className="App-header">
          <h1 className="App-title">Different Genres</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>Genre</th>
              <th>View Quizzes</th>
              <th>View Leaderboard</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map( (item, key) =>{
               return (
                  <tr key = {key}>
                      <td>
                      <h2>{item.genrename}</h2>
                      <img src={require(`./st/${item.genrename}.png`)} alt={item.genrename}/>
                      </td>
                      <td>
                          <Link to={`/quiz/${item.id}`} onClick={() => {this.state.my += `${item.id}`;this.setState({qv: true});}}>click</Link>
                          </td>
                      <td>
                      <Link to={`/genboard/${item.id}`} onClick={() => {this.state.myvar += `${item.id}`;this.setState({bv: true});}}>View</Link>
                      </td>
                  </tr>
                  
                )
             })}
          </tbody>
       </table>
       </div>
       <Switch>
            <Route path='/quiz/:id' exact component={Quizzes} />
            <Route path='/genboard/:id' exact component={Genboard} />   
        </Switch>              
       </div>
            </Router>
      
    );
            }
            else if(this.state.qv === true)
            {
                return(
                    <Quizzes id={this.state.my}/>
                )
            }
            else if(this.state.bv === true)
            {
                // alert(this.state.myvar)
                return(
                    
                    <Genboard id={this.state.myvar}/>
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

Genres.contextTypes = {
    router: PropTypes.func.isRequired
  };
export default Genres;
