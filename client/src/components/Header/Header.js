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
      endpoint: 'http://localhost:4000'
    }

    this.authenticatedHandler()
  }

  // 로그아웃
  logoutHandler = async() => {
    await authService.logout();
    window.location.reload();
  }

  authenticatedHandler = async() => {
    // 로그인 유무 확인
    const check = await authService.isAuthenticated();
    if (check) {
      this.setState({
        isloggined: true
      })

      const socket = socketIOClient(this.state.endpoint);
      // publicRoom 참여 check.msg = username
      socket.emit('enter public room', check.msg)
      socket.on('success public room', () => {
        console.log('success public room ');
        socket.emit('get all users');
      })

      socket.on('success get users', (allUsers) => {
        this.setState({
          allUsers: allUsers
        }, () => {
          // 부모(App.js)로 로그인 유무 전달, 채팅 모든 유저 정보 전달
          this.props.isLogginHandler(this.state.isloggined, this.state.allUsers)
        })
      })
      
    } 

    

    
  }

  render() {
    const isAlreadyAuthentication = this.state.isloggined
    // console.log('ss'+ isAlreadyAuthentication)
    //console.log(this.state.allUsers);
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
