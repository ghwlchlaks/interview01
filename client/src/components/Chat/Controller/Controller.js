import React, { Component } from 'react'
import './Controller.css';
import { Col, InputGroup, InputGroupAddon, Input, Button } from "reactstrap";

export default class Controller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeUserList: props.activeUserList,
      message: '',
      socket: props.socket,
      username: props.username,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socket !== this.state.socket) {
      this.setState({
        socket: nextProps.socket
      })
    }

    if (nextProps.activeUserList !== this.state.activeUserList) {
      this.setState({
        activeUserList: nextProps.activeUserList
      })
    }

    if (nextProps.username !== this.state.username) {
      this.setState({
        username: nextProps.username
      })
    }
  }

  messageChangeHandler = (e) => {
    const value = e.target.value
    this.setState({
      message: value
    })
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

  keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.massageSendHandler();
    }
  }

  render() {
    const activeUserList = this.state.activeUserList;
    const message = this.state.message;

    return (
    <Col>
      <InputGroup>
        <InputGroupAddon 
          addonType="prepend">
          {activeUserList}
        </InputGroupAddon>
        <Input 
          placeholder="메시지를 입력하세요" 
          onChange={this.messageChangeHandler} 
          value={message} 
          onKeyDown={this.keyPressHandler}/>
        <Button 
          onClick={this.massageSendHandler}>
          전송
        </Button>
      </InputGroup>
    </Col>
    )
  }
}
