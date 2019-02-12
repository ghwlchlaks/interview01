import React, { Component } from 'react';
import './App.css';

import * as testService from "./services/test";

class App extends Component {
  state = {
    user : null
  }
  componentDidMount() {
    testService.getData().then((user)=>this.setState({user: user.username}));
  }
  render() {
    const {user} = this.state;
    return (
      <div>
      {user ? <h1>{`Hello ${user}`}</h1> : <h1>Loading.. please wait!</h1>}
      </div>
    );
  }
}

export default App;
