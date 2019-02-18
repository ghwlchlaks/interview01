import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      socket: props.socket,
      to: 'public',
    }

    //console.log(props.socket);
    // 모든 유저 정보 props.allUsers._id, username, socketId
    // console.log(props.allUsers);
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
    let publicUsername
    let publicMsg
    let privateUsername
    let privateMsg

    if (nextProps.publicReceivedInfo) {
      publicUsername = nextProps.publicReceivedInfo.username;
      publicMsg = nextProps.publicReceivedInfo.msg;
    }
    
    if (nextProps.privateReceivedInfo) {
      privateUsername = nextProps.privateReceivedInfo.username
      privateMsg = nextProps.privateReceivedInfo.msg;
    }

    console.log('public ', publicUsername, publicMsg);
    console.log('private ', privateUsername, privateMsg);
    // 동적 메시지 추가
  }

  chatListChangeHandler = (e) => {

    const to = e.target.value
    const from = this.props.username

    this.setState({
      to: to
    })
    if (to === 'public'){
      // 전체 채팅 받아오기
      this.state.socket.emit('get public message', from);
    } else {
      // 귓속말 채팅 받아오기
      this.state.socket.emit('get private message', from, to)
    }
  }
  
  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined

    return (
      <div>
        {/* 로그인 유무에 따른 리다이렉션 */}
        {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}}/> : (
        <div className="col-md-6 col-md-offset-3">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <span className="glyphicon glyphicon-comment"></span> Chat
            </div>
            <div className="panel-body">
              <ul className="chat"> </ul>
            </div>
            <div className="panel-footer">
              <div className="input-group">
                <input onChange={this.messageChangeHandler} id="Mensaje" type="text" className="form-control input-sm" placeholder="input message" />
                <span className="input-group-btn">
                  <button onClick={this.massageSendHandler} className="btn btn-warning btn-sm" id="btnEnviar">전송</button>
                </span>
              </div>
            </div>
          </div>
          <select onChange={this.chatListChangeHandler}>
            <option value="public">전체</option>
            <option value="test">test</option>
            <option value="test1">test1</option>
          </select>
        </div>
        
        )}
      </div>
    )
  }
}
