import React, { Component } from 'react'
import './Header.css';
import {Link} from 'react-router-dom'
export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <Link to="/" className="item">홈</Link>
        <Link to="/fileManager/test" className="item">파일매니저</Link>
        <Link to="/posts" className="item">포스트</Link>
        <Link to="/mypage" className="item">마이페이지</Link>
        <Link to="/login" className="item">로그인</Link>
      </div>
    )
  }
}
