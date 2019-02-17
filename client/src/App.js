import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import * as testService from "./services/test";

import Home from './routes/Home/Home';
import FileManager from './routes/FileManager/FileManager';
import Posts from './routes/Posts/Posts';
import Chat from './routes/Chat/Chat';
import Login from './routes/Login/Login';
import Signup from './routes/Signup/Signup';
import NoMatch from './routes/NotFound/NotFound';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloggined: false,
      allUsers: null,
      socket: null,
      username: null,
    }
  }

  isLogginHandler = (isloggined, username, allUsers, socket) => {
    this.setState({
      isloggined : isloggined,
      allUsers: allUsers, 
      socket: socket,
      username: username
    })
  }

  receiveMessageHandler = (username, msg) => {
    // console.log(msg);
    this.setState({
      receivedInfo : {
        username: username,
        msg: msg
      }
    })
  }

  render() {
    // console.log('app'+ this.state.isloggined)
    return (
      <div>
      <Router>
        <div id="contents">
          <Header isLogginHandler={this.isLogginHandler} receiveMessageHandler={this.receiveMessageHandler}></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/fileManager/:username" component={FileManager} />
            <Route path="/posts" component={Posts} />
            {/* <Route path="/login" render={(props) => } component={Login} /> */}
            <Route path="/login" render={(props) => <Login isloggined={this.state.isloggined} {...props} />} />
            <Route path="/signup" component={Signup} />
            <Route 
              path="/chat" 
              render={(props) => 
                <Chat 
                  isloggined={this.state.isloggined} 
                  username={this.state.username} 
                  allUsers={this.state.allUsers} 
                  socket={this.state.socket}
                  receivedInfo={this.state.receivedInfo}
                  {...props}
                  />}
                />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
      <div>
        <Footer></Footer>
      </div>  
      </div>

    );
  }
}

export default App;
