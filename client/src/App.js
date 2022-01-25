import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./components/layout/home";
import User from './components/layout/user';
import Admin from './components/layout/admin';

class App extends Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/user' component={User} />
              <Route exact path='/admin' component={Admin} />
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
