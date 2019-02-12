import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

import * as testService from "./services/test";

class App extends Component {
  state = {
    user : null,
    endpoint: "http://localhost:4000",
    color: "white",
    msg: '',
    receiveMsg: ''
  }
  componentDidMount() {
    testService.getData().then((user)=>this.setState({user: user.username}));
  }

  sendMsg = () => {
    const socket = socketIOClient(this.state.endpoint);
  
    // 서버에게 해당 메시지 전달 
    socket.emit('allSendMsg', this.state.msg);
  }

  changeHandler = (e) => {
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const {user} = this.state;
    const socket = socketIOClient(this.state.endpoint);

    socket.on('allSendMsg', (msg) => {
      this.setState({
        receiveMsg: msg
      })
    })

    return (
      <div>
        <div>
        {user ? <h1>{`Hello ${user}`}</h1> : <h1>Loading.. please wait!</h1>}
        </div>
        <div>
          <textarea 
            row="30"
            placeholder="메시지를 입력해주세요"
            onChange={this.changeHandler}
            name="msg"
            ></textarea>
          <button onClick={this.sendMsg}>전송</button>
          <h2>{this.state.receiveMsg}</h2>
        </div>
      </div>
    );
  }
}

export default App;
