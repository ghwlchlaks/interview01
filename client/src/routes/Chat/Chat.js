import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';
import {ListGroup, 
        ListGroupItem, 
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
      to: 'public',
      username: props.username
    }
  }

  componentDidMount() {
    this.setState({
      socket: this.props.socket
    }, () => {
      // 전체 채팅 받아오기
      this.state.socket.emit('get public message', this.props.username);
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
    const from = this.props.username
    const to = this.state.to;
    const msg  = this.state.message
    console.log('messageSendHandler : ', to);

    if(to === 'public'){
      // 전체 채팅 전송
      this.state.socket.emit('public send message', from, msg);
    } else {
      // 귓속말 전송
      this.state.socket.emit('private send message', from, to, msg)
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
    if (nextProps.publicMessage) {
      this.setState({
        publicMessage: nextProps.publicMessage,
      }, () => {
        // 전달받은 전체 메시지 추가
        this.setState({
          publicAllMsg: [...this.state.publicAllMsg, this.state.publicMessage]
        })
      })
    }
    
    if (nextProps.privateReceivedInfo) {
      // privateUsername = nextProps.privateReceivedInfo.username
      // privateMsg = nextProps.privateReceivedInfo.msg;
    }

    if (nextProps.publicAllmessage) {
      this.setState({
        publicAllMsg: nextProps.publicAllmessage
      })
    }
  }

  chatListChangeHandler = (e) => {

    const to = e.target.value
    const from = this.props.username

    this.setState({
      to: to
    })
    if (to === 'public'){
      // 전체 채팅 보내기
      this.state.socket.emit('get public message', from);
    } else {
      // 귓속말 채팅 보내기
      this.state.socket.emit('get private message', from, to)
    }
  }
  // test = (e) => {
  //   console.log(e.target.name)
  // }

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

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    const publicAllMsg = this.state.publicAllMsg

    return (
      <Container>
        {/* 로그인 유무에 따른 리다이렉션 */}
        {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}}/> : (
        <Row>
          <Col md="8">
            <div id="chat_ul">
              {publicAllMsg ? this.makePublicChatList(publicAllMsg) : ''}
            </div>

            <Row>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">{this.state.to}</InputGroupAddon>
                  <Input placeholder="메시지를 입력하세요" onChange={this.messageChangeHandler} />
                  <Button onClick={this.massageSendHandler}>전송</Button>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        
          <Col md="4">
            <ListGroup onClick={this.test} id="partcipant_list">
              <ListGroupItem name="public">전체</ListGroupItem>
              <ListGroupItem name="test">test</ListGroupItem>
              <ListGroupItem name="test1">test1</ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        )}
      </Container>
    )
  }
}

              {/* <select onChange={this.chatListChangeHandler}>
              <option value="public">전체</option>
              <option value="test">test</option>
              <option value="test1">test1</option>
            </select> */}