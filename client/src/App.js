import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {Container} from 'reactstrap';

import Home from './components/Home/Home';
import FileManager from './components/FileManager/FileManager';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import NoMatch from './components/NotFound/NotFound';

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

  receivePublicMessageHandler = (publicMessage) => {
    this.setState({
      publicMessage :publicMessage
    })
  }

  getPublicMessageHandler = (allMessage) => {
    this.setState({
      publicAllmessage: allMessage
    })
  }

  receiveprivateMessageHandler = (privateMessage) => {
    this.setState({
      privateReceivedInfo : privateMessage
    })
  }

  getPrivateMessageHandler = (message) => {
    this.setState({
      privateMessage: message
    })
  }

  render() {
    return (
      <div>
      <Router>
        <div>
          <Header 
            isLogginHandler={this.isLogginHandler} 
            receivePublicMessageHandler={this.receivePublicMessageHandler}
            receiveprivateMessageHandler={this.receiveprivateMessageHandler}
            getPublicMessageHandler={this.getPublicMessageHandler}
            getPrivateMessageHandler={this.getPrivateMessageHandler}
            username={this.state.username}
            >
          </Header>
          <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route 
              path="/fileManager/:username" 
              render={(props) => 
              <FileManager isloggined={this.state.isloggined} checkLogined={this.checkLogined} {...props} />}  
              />
            <Route 
              path="/login" 
              render={(props) =>
                 <Login isloggined={this.state.isloggined} {...props} />} 
              />
            <Route 
              path="/signup" 
              render={(props) => 
              <Signup isloggined={this.state.isloggined} {...props}/>} 
              />
            <Route 
              path="/chat" 
              render={(props) => 
                <Chat 
                  isloggined={this.state.isloggined} 
                  username={this.state.username} 
                  allUsers={this.state.allUsers} 
                  socket={this.state.socket}
                  publicMessage={this.state.publicMessage}
                  privateReceivedInfo={this.state.privateReceivedInfo}
                  publicAllmessage={this.state.publicAllmessage}
                  privateMessage={this.state.privateMessage}
                  isLogginHandler={this.isLogginHandler} 
                  receivePublicMessageHandler={this.receivePublicMessageHandler}
                  receiveprivateMessageHandler={this.receiveprivateMessageHandler}
                  getPublicMessageHandler={this.getPublicMessageHandler}
                  getPrivateMessageHandler={this.getPrivateMessageHandler}
                  {...props}
                  />}
                />
            <Route component={NoMatch} />
          </Switch>
                    
          <Footer></Footer>
          </Container>

        </div>
      </Router>
      </div>
      

    );
  }
}

export default App;
