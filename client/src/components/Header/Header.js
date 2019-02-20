import React, { Component } from 'react'
import './Header.css';
import {Link} from 'react-router-dom'
import { Button} from "reactstrap";
import goorm_img from '../../images/goorm_img.svg';
import * as authService from '../../services/auth';
import socketIOClient from 'socket.io-client';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggined: false,
      endpoint: 'http://localhost:4000',
      isUpdate: false,
    }

    this.authenticatedHandler()
  }

  // 로그아웃
  logoutHandler = async() => {
    await authService.logout();
    window.location.reload();
  }

  componentDidUpdate = () => {
    //현재 state가 로그인된 상태에서만 적용
    if (this.state.isloggined) {

    // 로그인 유무 검사
    this.authCheck().then((auth) => {
      // 로그아웃상태라면 state수정후 
      if(!auth) {
        this.setState({
          isloggined: false,
          username: null,
        }, () => {
          // 로그인 페이지로
          if (!this.state.isUpdate) {
            this.setState({
              isUpdate: true,
            }, () => {
              alert('세션이 만료되어 로그아웃 처리됐습니다.');
              window.location.reload();
            })
          }
        })
      } else {
        console.log('로그인 상태')
      }
    })
  }
  }

  authCheck = () => {
    return authService.isAuthenticated();
  }
  authenticatedHandler = async() => {
    // 로그인 유무 확인
    // const check = await authService.isAuthenticated();
    const check = await this.authCheck()
    if (check) {
      this.setState({
        isloggined: true,
        username: check.msg
      })

      const socket = socketIOClient(this.state.endpoint);
      // publicRoom 참여 check.msg = username
      socket.emit('enter public room', check.msg)
      socket.on('success public room', () => {
        // 모든 유저 정보 요청
        socket.emit('get all users');
      })

      // 모든 유저 정보 이벤트 연결
      socket.on('success get users', (allUsers) => {
        this.setState({
          allUsers: allUsers
        }, () => {
          // 부모(App.js)로 로그인 유무 전달, 채팅 모든 유저 정보 전달
          this.props.isLogginHandler(this.state.isloggined, this.state.username, this.state.allUsers, socket)
        })
      })
      
      // 전체 채팅 이벤트 연결
      socket.on('public message', (publicMessage) => {
        this.setState({publicMessage: publicMessage});
        this.props.receivePublicMessageHandler(publicMessage);
      })

      // 전체 채팅 내역 
      socket.on('public all message', (allMessage) => {
        //Chat.js 컴포넌트로 전달 예정 (전체 메시지)
        this.props.getPublicMessageHandler(allMessage)
      })

      // 귓속말 채팅 이벤트 연결
      socket.on('private message', (privateMessage) => {
        this.setState({privateMessage: privateMessage});
        this.props.receiveprivateMessageHandler(privateMessage)
      })

      // 귓속말 내역
      socket.on('private get message', (message) => {
        this.props.getPrivateMessageHandler(message)
      })

    } 

    

    
  }

  render() {
    const isAlreadyAuthentication = this.state.isloggined
    if (isAlreadyAuthentication) {
      return (
        <div className="header">
          <Link to="/" className="item"><img src={goorm_img} id="App-head-logo" alt="goorm_img" /></Link>
          <Link to="/fileManager/test" className="item">파일매니저</Link>
          <Link to="/chat" className="item">채팅 </Link>
          <Button className="item" onClick={this.logoutHandler}>로그아웃</Button>
        </div>
      )
    } else {
      return (
        <div className="header">
          <Link to="/" className="item"><img src={goorm_img} id="App-head-logo" alt="goorm_img" /></Link>
          <Link to="/login" className="item">로그인</Link>
          <Link to="/signup" className="item">회원가입</Link>
        </div>
      )
    }
  }
}
