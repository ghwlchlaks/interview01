import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import * as testService from "./services/test";

import Home from './routes/Home';
import FileManager from './routes/FileManager';
import Posts from './routes/Posts';
import MyPage from './routes/MyPage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import NoMatch from './routes/NotFound';

import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloggedin: true
    }
  }

  isAuthentication = () => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  render() {
    const isAlreadyAuthentication = this.isAuthentication();
    return (
      <div>
      <Router>
        <div id="contents">
          <Header isloggedin={isAlreadyAuthentication}></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/fileManager/:username" component={FileManager} />
            <Route path="/posts" component={Posts} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/mypage" component={MyPage} />
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
