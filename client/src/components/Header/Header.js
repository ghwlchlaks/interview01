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
           if (!this.state.isUpdate) {
            this.setState({
              isUpdate: true,
            }, () => {
              // 세션 만료시
              alert('세션이 만료되어 로그아웃 처리됐습니다.');
              window.location.reload();
            })
          }
        })
      } 
    })
  }
  }

  authCheck = () => {
    return authService.isAuthenticated();
  }
  authenticatedHandler = async() => {
    // 로그인 유무 확인
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


      // 중복 로그인되어있는 상대에게 
      socket.on('duplicated login', (duplicatedIp) => {
        authService.logout();
        alert(duplicatedIp + ' 에서 로그인으로 인해 로그아웃 처리됩니다.');
      })

      // 로그인 한 상대에게
      socket.on('duplicated relogin', () => {
        authService.logout()
        alert('중복로그인으로 인해 재접속해주시기 바랍니다.')
      })
  
    }   
  }

  render() {
    const isAlreadyAuthentication = this.state.isloggined
    if (isAlreadyAuthentication) {
      return (
        <div className="header">
          <Link to="/" className="item"><img src={goorm_img} id="App-head-logo" alt="goorm_img" /></Link>
          <Link to={`/fileManager/${this.props.username}`} className="item">파일매니저</Link>
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
