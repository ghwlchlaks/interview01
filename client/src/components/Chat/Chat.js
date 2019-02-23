import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';
import { Container,Row, Col } from 'reactstrap'
import ChatList from './ChatList/ChatList';
import UserList from './UserList/UserList';
import Controller from './Controller/Controller';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: props.socket,
      username: props.username,
      activeUserList: 'public',
      publicAllMsg: props.publicAllMsg,
    }
  }

  componentDidMount() {
    localStorage.removeItem('message');
    this.setState({
      socket: this.props.socket
    }, () => {
      // 전체 채팅 받아오기'
      this.state.socket.emit('get public message', this.props.username);
      this.state.socket.emit('get all users');
    })
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

  componentWillReceiveProps(nextProps) {
    // 메시지 (props) 변경이벤트

    if (nextProps.publicMessage && 
      this.state.activeUserList === 'public') {
        this.setState({
          publicMessage: nextProps.publicMessage,
          publicAllMsg: [...this.state.publicAllMsg, nextProps.publicMessage]
        })
        this.props.receivePublicMessageHandler( null);
      } 

     else if (nextProps.publicAllmessage &&
        this.state.activeUserList === 'public') {
       this.setState({
         publicAllMsg: nextProps.publicAllmessage
       })
       this.props.getPublicMessageHandler( null);
     }

      if (nextProps.privateReceivedInfo &&
        this.state.activeUserList !== 'public' &&
        (nextProps.privateReceivedInfo.username === this.state.activeUserList ||
        nextProps.privateReceivedInfo.username === this.state.username)) {
      this.setState({
        privateMessage: nextProps.privateReceivedInfo,
        privateAllMsg: [...this.state.privateAllMsg,  nextProps.privateReceivedInfo],
        publicAllMsg: [...this.state.publicAllMsg, nextProps.privateReceivedInfo]
      })
      this.props.receiveprivateMessageHandler(null);
    } 

    else if (nextProps.privateMessage && 
      this.state.activeUserList !== 'public') {
      this.setState({
        privateMessage: nextProps.privateMessage,
        privateAllMsg: nextProps.privateMessage,
        publicAllMsg: nextProps.privateMessage
      })
      this.props.getPrivateMessageHandler(null)
    }


    if (nextProps.allUsers) {  
      this.setState({
        allUsers: nextProps.allUsers
      })
    }

  }

  receiveActiveUser = (activeUser) => {
    this.setState({
      activeUserList: activeUser
    })
  }

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    const publicAllMsg = this.state.publicAllMsg;
    const allUsers = this.state.allUsers;
    const username = this.state.username;
    const socket = this.state.socket;
    const activeUserList = this.state.activeUserList;

    return (
      <Container>
        {/* 로그인 유무에 따른 리다이렉션 */}
        {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}}/> : (
        <Row id="chat_wrapper">
          <Col md="4" id="user_list_wrapper">
            <UserList
              allUsers={allUsers}
              username={username}
              socket={socket}
              receiveActiveUser={this.receiveActiveUser}
            ></UserList>
          </Col>
          <Col md="8" id="chat_list_wrapper">
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
        )}
      </Container>
    )
  }
}