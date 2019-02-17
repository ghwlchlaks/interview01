import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      socket: props.socket
    }

    //console.log(props.socket);
    // 모든 유저 정보 props.allUsers._id, username, socketId
    // console.log(props.allUsers);
  }

  componentDidMount() {
    console.log('1');
  }

  componentDidUpdate(prevProps, prevState) {
    // header컴포넌트에서 socket값 가져온 이후에 호출
    console.log(prevState.socket)
    console.log(prevProps.socket)
    console.log(this.state.socket)
    if (prevState.socket === null && prevProps.socket === null && this.state.socket !== null) {
        // 모든 전체 채팅 내용 호출
      this.state.socket.emit('get public message', this.props.username);
    }
  }

  massageSendHandler = () => {
    // console.log(this.state.message);

    //전체 채팅 전송
    this.state.socket.emit('public send message', this.props.username, this.state.message);
  }

  messageChangeHandler = (e) => {
    const value = e.target.value
    this.setState({
      message: value
    })
  }

  componentWillReceiveProps(nextProps) {
    // 메시지 (props) 변경이벤트
    const {username, msg} = nextProps.receivedInfo;
    // 동적 메시지 추가
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
        </div>
        )}
      </div>
    )
  }
}
