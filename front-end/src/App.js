import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/homepage';
import Profile from './components/profile';
import Genres from './components/genres';
import ViewUsers from './components/users';
import Quizzes from './components/quiz';
import Logout from './components/logout';
import lboard from './components/leaderboard';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    function refreshPage(){ 
      setTimeout(function() { window.location.reload(); }, 100); 
  }
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            { JSON.parse(localStorage.getItem("authentication")) === false || localStorage.getItem("authentication")===null 
              &&
              <div className="container-fluid">
              <ul className="navbar-nav">
                 <li className="navbar-brand"><Link className="navbar-brand" to={'/'} className="nav-link">Quiz App</Link></li> 
                <li className="nav-item"><Link to={'/'} className="nav-link">Home</Link></li>
                <li className="nav-item"><Link to={'/login'} className="nav-link">Login</Link></li>
                <li className="nav-item"><Link to={'/register'} className="nav-link">Signup</Link></li>
                </ul>
              </div>
            }
            {JSON.parse(localStorage.getItem("authentication")) === true && localStorage.getItem("admin") === null &&
            <div className="container-fluid">
            <ul className="navbar-nav">
               <li className="navbar-brand"><Link className="navbar-brand" to={'/'} className="nav-link">Quiz App</Link></li> 
              <li className="nav-item"><Link to={'/profile'} className="nav-link">Home</Link></li>
              {/* <li className="nav-item"><Link to={'/login'} className="nav-link">Login</Link></li> */}
              {/* <li className="nav-item"><Link to={'/register'} className="nav-link">Signup</Link></li> */}
              <li className="nav-item"><Link to={'/logout'} className="nav-link" onClick={ refreshPage }>Logout</Link></li>
              <li className="nav-item"><Link to={'/users'}className="nav-link">All USERS</Link></li>
              <li className="nav-item"><Link to={'/genres'}className="nav-link" onClick ={() => window.location.reload()}>View Genres</Link></li>
              <li className="nav-item"><Link to={'/aleaderboard'}className="nav-link">Leaderboard</Link></li>
              </ul>
            </div>
            }
             {JSON.parse(localStorage.getItem("authentication")) === true && JSON.parse(localStorage.getItem("admin")) === true &&
            <div className="container-fluid">
            <ul className="navbar-nav">
               <li className="navbar-brand"><Link className="navbar-brand" to={'/'} className="nav-link">Quiz App</Link></li> 
              <li className="nav-item"><Link to={'/profile'} className="nav-link">Home</Link></li>
              {/* <li className="nav-item"><Link to={'/login'} className="nav-link">Login</Link></li> */}
              {/* <li className="nav-item"><Link to={'/register'} className="nav-link">Signup</Link></li> */}
              <li className="nav-item"><Link to={'/logout'} className="nav-link" onClick={ refreshPage }>Logout</Link></li>
              <li className="nav-item"><Link to={'/users'}className="nav-link">All USERS</Link></li>
              <li className="nav-item"><Link to={'/genres'}className="nav-link" onClick ={() => window.location.reload()}>View Genres</Link></li>
              <li className="nav-item"><Link to={'/aleaderboard'}className="nav-link">Leaderboard</Link></li>
              <li className="nav-item"><a href="http://localhost:8080/admin" className="nav-link">Admin View</a></li>
              {/* <li className="nav-item"><Link to={'/adquesview'}className="nav-link">AdQuesview</Link></li> */}
              </ul>
            </div>
            }
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 <Route exact path='/login' component={Login} />
                 <Route exact path='/register' component={Signup} />
                 <Route exact path='/profile' component={Profile} />
                 <Route exact path='/logout' component={Logout} />
                 <Route exact path='/users' component={ViewUsers} />
                  <Route exact path='/genres' component={Genres} />
                  <Route exact path='/aleaderboard' component={lboard} /> 
                  {/* <Route exact path='/adquesview' component={Adquesview} /> */}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
