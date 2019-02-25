import React, { Component } from "react";
import './Chat.css';
import { Container,Row, Col } from 'reactstrap'
import ChatList from './ChatList/ChatList';
import UserList from './UserList/UserList';
import Controller from './Controller/Controller';
import {Redirect} from 'react-router-dom';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggined: props.isloggined,
      socket: props.socket,
      username: props.username,
      activeUserList: 'public',
      publicAllMsg: props.publicAllMsg,
    }
  }

  componentDidMount() {
    this.setState({
      socket: this.props.socket
    }, () => {
      // 전체 메시지, 유저리스트 가져오기
      this.state.socket.emit('get public message', this.state.username)
      this.state.socket.emit('get all users');
    })
    localStorage.removeItem('message');
  }

  componentDidUpdate(prevProps, prevState) {
    this.lastLineFocus();
  }

  // 마지막 메시지 스크롤 포커스
  lastLineFocus = () => {
    const lists = document.getElementsByClassName('chat_content')
    if (lists.length > 0) {
      lists[lists.length - 1].scrollIntoView()
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    
    // 유저리스트 비교
    if (nextProps.allUsers !== prevState.allUsers) {
      return {
        allUsers: nextProps.allUsers
      }
    }

    if (nextProps.isloggined !== prevState.isloggined) {
      return {
        isloggined: nextProps.isloggined
      }
    }

    if(nextProps.username !== prevState.username) {
      return{
        username: nextProps.username
      }
    }

    // 현재 active된것이 전체 채팅
    if (nextProps.publicMessage && prevState.activeUserList === 'public') {
      nextProps.receivePublicMessageHandler(null);
      return {
        publicAllMsg: [...prevState.publicAllMsg, nextProps.publicMessage]
      }
    } else if (nextProps.publicAllmessage && prevState.activeUserList === 'public') {
      // 전체 메시지 props전달받았을때
      nextProps.getPublicMessageHandler(null);
      return {
        publicAllMsg: nextProps.publicAllmessage
      }
    }

    if (nextProps.privateReceivedInfo && prevState.activeUserList !== 'public' &&
        (nextProps.privateReceivedInfo.username === prevState.activeUserList ||
        nextProps.privateReceivedInfo.username === prevState.username)) {
          // 귓속말 전달
      nextProps.receiveprivateMessageHandler(null);
      return {
        publicAllMsg: [...prevState.publicAllMsg, nextProps.privateReceivedInfo]
      }
    } else if (nextProps.privateMessage && prevState.activeUserList !== 'public') {
      // 귓속말 모든 데이터
      nextProps.getPrivateMessageHandler(null)
      return {
        publicAllMsg: nextProps.privateMessage
      }  
    }

    return null;
  }

  receiveActiveUser = (activeUser) => {
    this.setState({
      activeUserList: activeUser
    })
  }

  render() {
    const isAlreadyAuthentication = this.state.isloggined;
    const publicAllMsg = this.state.publicAllMsg;
    const allUsers = this.state.allUsers;
    const username = this.state.username;
    const socket = this.state.socket;
    const activeUserList = this.state.activeUserList;

    return (
      <Container>
        {isAlreadyAuthentication ? (
          <Row id="chat_wrapper">
          <Col md="4" sm="4" xs="12" id="user_list_wrapper">
            <UserList
              allUsers={allUsers}
              username={username}
              socket={socket}
              receiveActiveUser={this.receiveActiveUser}
            ></UserList>
          </Col>

          <Col md="8" sm="8" xs="12" id="chat_list_wrapper">
            <Row>
              <ChatList
                publicAllMsg={publicAllMsg}
                username={username}
              ></ChatList>
            </Row>
            <Row>
              <Controller
                socket={socket}
                username={username}
                activeUserList={activeUserList}
              ></Controller>
            </Row>
          </Col>
          
        </Row>
        ) : <Redirect to="/" />}
        
      </Container>
    )
  }
}