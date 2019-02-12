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
import NoMatch from './routes/NotFound';

import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/fileManager/:username" component={FileManager} />
            <Route path="/posts" component={Posts} />
            <Route path="/login" component={Login} />
            <Route path="/mypage" component={MyPage} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
