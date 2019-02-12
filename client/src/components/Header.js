import React, { Component } from 'react'
import './Header.css';
import {Link} from 'react-router-dom'

import goorm_img from '../images/goorm_img.svg';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        
        <Link to="/" className="item"><img src={goorm_img} id="App-head-logo" alt="goorm_img" /></Link>
        <Link to="/fileManager/test" className="item">파일매니저</Link>
        <Link to="/posts" className="item">포스트</Link>
        <Link to="/mypage" className="item">마이페이지</Link>
        <Link to="/login" className="item">로그인</Link>
        <Link to="/signup" className="item">회원가입</Link>
      </div>
    )
  }
}
