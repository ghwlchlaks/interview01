import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import * as testService from "./services/test";

import Home from './routes/Home';
import FileManager from './routes/FileManager';
import Posts from './routes/Posts';

import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header></Header>
          <Route exact path="/" component={Home} />
          <Route path="/fileManager/:username" component={FileManager} />
          <Route path="/posts" component={Posts} />
        </div>
      </Router>
    );
  }
}

export default App;
