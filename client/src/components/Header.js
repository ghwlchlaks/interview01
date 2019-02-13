import React, { Component } from 'react'
import './Header.css';
import {Link} from 'react-router-dom'
import { Button} from "reactstrap";
import goorm_img from '../images/goorm_img.svg';
import * as authService from '../services/auth';

export default class Header extends Component {
  logoutHandler = async() => {
    await authService.logout();
    localStorage.removeItem('userInfo');
    this.setState({});
  }

  isAuthentication = () => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  render() {
    const isAlreadyAuthentication = this.isAuthentication();
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
