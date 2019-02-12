import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

import * as testService from "./services/test";

class App extends Component {
  state = {
    user : null,
    endpoint: "http://localhost:4000",
    color: "white"
  }
  componentDidMount() {
    testService.getData().then((user)=>this.setState({user: user.username}));
  }
  send = () => {
    const socket = socketIOClient(this.state.endpoint);

    socket.emit('change color', this.state.color);
  }

  setColor = (color) => {
    this.setState({color: color})
  }

  render() {
    const {user} = this.state;
    const socket = socketIOClient(this.state.endpoint);

    socket.on('change color', (color) => {
      document.body.style.backgroundColor = color;
    })
    return (
      <div>
        <div>
        {user ? <h1>{`Hello ${user}`}</h1> : <h1>Loading.. please wait!</h1>}
        </div>
        <div>
          <button onClick={this.send}>change color</button>
          <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
          <button id="red" onClick={() => this.setColor('red')}>Red</button>
        </div>
      </div>
    );
  }
}

export default App;
