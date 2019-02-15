import React, { Component } from 'react'
import './Header.css';
import {Link} from 'react-router-dom'
import { Button} from "reactstrap";
import goorm_img from '../images/goorm_img.svg';
import * as authService from '../services/auth';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloggined: false
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
    } 

    // 부모(App.js)로 로그인 유무 전달
    this.props.isLogginHandler(this.state.isloggined)
  }

  render() {
    const isAlreadyAuthentication = this.state.isloggined
    // console.log('ss'+ isAlreadyAuthentication)
    if (isAlreadyAuthentication) {
      return (
        <div className="header">
          <Link to="/" className="item"><img src={goorm_img} id="App-head-logo" alt="goorm_img" /></Link>
          <Link to="/fileManager/test" className="item">파일매니저</Link>
          <Link to="/mypage" className="item">채팅 </Link>
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
