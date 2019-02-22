import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';
import {
        Container,
        Row, 
        Col, 
        Button, 
        InputGroup, 
        InputGroupAddon,
        Input 
      } from 'reactstrap'

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: props.socket,
      username: props.username,
      activeUserList: 'public',
      publicAllMsg: [],
      message: ''
    }
  }

  componentDidMount() {
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
    const lists = document.getElementsByClassName('content')
    if (lists.length > 0) {
      lists[lists.length - 1].scrollIntoView()
    }
  }

  massageSendHandler = () => {

    if (this.state.message.length > 0) {
      const from = this.props.username
      const to = this.state.activeUserList;
      const msg  = this.state.message
    
      if(to === 'public'){
        // 전체 채팅 전송
        this.state.socket.emit('public send message', from, msg);
      } else {
        // 귓속말 전송
        this.state.socket.emit('private send message', from, to, msg)
      }

      this.setState({
        message: ''
      })

    } else {
      alert('메시지를 입력해주세요');
    }
  }

  messageChangeHandler = (e) => {
    const value = e.target.value
    this.setState({
      message: value
    })
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

  distinctMsg = (item) => {
    const {_id, username, sender, message, createdDate} = item;
    // username = 송신자 , this.state.username = 현재 나의 계정 
    if (username !== this.state.username) {
      // 내가 보낸것이 아니라면
      return (
      <div className="incoming_msg content" key={_id}>
        <div className="received_msg">
          <div className="received_withd_msg">
            <strong>{username}</strong>
            <p>{message}</p>
            <span className="tiem_date">{createdDate}</span>
          </div>
        </div>
      </div>
      )
    } else {
      // 내가 보낸것이라면
      return (
      <div className="outgoing_msg content" key={_id}>
        <div className="sent_msg">
          <p>{message}</p>
          <span className="tiem_date">{createdDate}</span>
        </div>
      </div>
      )
    }
  }

  makePublicChatList = (list) => {
    if (list) {
      return (
        list.map((item) => {
          return this.distinctMsg(item)
        })
      )
    }
  }

  makeUserList = (allUsers) => {
    if (allUsers) {
      return (
        allUsers.map((user) => {
          if (user.username !== this.state.username) {
            return (         
              <li 
                key={user.socketId} 
                onClick={this.userListClickHandler} 
                id={user.username} 
                className="list-group-item">
                {user.username}
              </li>
            )
          }
        })
      )
    }
  }

  userListClickHandler = (e) => {
    const beforeActiveTag = document.getElementsByClassName('list-group-item active')[0]
    if (beforeActiveTag) {
      const afterActiveTag = e.target;
      if (afterActiveTag.id !== this.state.activeUserList) {
        beforeActiveTag.classList.toggle('active')
        
        afterActiveTag.classList.toggle('active');
        this.setState({
          activeUserList: afterActiveTag.id
        }, () => {

          const from = this.props.username
          const to = this.state.activeUserList
          if ( to === 'public') {
            // 전체 채팅 가져오기
            this.state.socket.emit('get public message', from);
          } else {
            // from 과 to의 채팅 가져오기
            this.state.socket.emit('get private message', from, to)
          }
      })
    }
    }
  }

  keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.massageSendHandler();
    }
  }

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    const publicAllMsg = this.state.publicAllMsg
    const allUsers = this.state.allUsers

    return (
      <Container>
        {/* 로그인 유무에 따른 리다이렉션 */}
        {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}}/> : (
        <Row id="chat_wrapper">
        
          <Col md="4" id="user_list_wrapper">
            <div className="panel panel-info">
                <ul className="list-group">
                    <li 
                      onClick={this.userListClickHandler} 
                      id="public" 
                      className="list-group-item active">전체
                      </li>
                    {allUsers ? this.makeUserList(allUsers) : ''}
                </ul>
            </div>
          </Col>

          <Col md="8" id="chat_list_wrapper">
            <Row>
              <div id="chat_ul">
                {publicAllMsg ? 
                  this.makePublicChatList(publicAllMsg): ''}
              </div>
            </Row>

            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">{this.state.activeUserList}</InputGroupAddon>
                  <Input placeholder="메시지를 입력하세요" onChange={this.messageChangeHandler} value={this.state.message} onKeyDown={this.keyPressHandler}/>
                  <Button onClick={this.massageSendHandler}>전송</Button>
                </InputGroup>
              </Col>
            </Row>
            
          </Col>

        </Row>
        )}
      </Container>
    )
  }
}