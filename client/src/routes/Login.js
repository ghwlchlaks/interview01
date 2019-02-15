import React, { Component } from 'react'
import { Button, Input, FormGroup, Form } from "reactstrap";
import {Redirect} from 'react-router-dom';

import './Login.css';
import * as authService from '../services/auth';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: {
        username: '',
        password: '',
      },
    }
  }

  loginHandler = async() => {
    const auth = await authService.login(this.state.loginInfo);
    if(auth) {
      window.location.reload()
    } else {
      alert('잘못된 계정!');
    }
  }

  changeHandler = (e) => {
    const {name, value} = e.target;
    this.setState({
      loginInfo: {
        ...this.state.loginInfo,
        [name]: value
      }
    })
  }

  isAuthentication = () => {
    return authService.isAuthenticated();
  }
  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    return (
      <div>
      {/* 로그인 유무에 따른 리다이렉션 */}
      {isAlreadyAuthentication ? <Redirect to={{pathname: '/'}} /> : (
          <div className="Login">
          <Form>
            <FormGroup>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="아이디" 
                onChange={this.changeHandler}
                name="username"
                />
            </FormGroup>
            <FormGroup>
              <Input 
                type="password" 
                name="password"
                id="password" 
                placeholder="비밀번호"
                onChange={this.changeHandler}
                name="password"
                />
            </FormGroup>
            <Button 
              id="LoginBtn"
              onClick={this.loginHandler}
              >로그인</Button>
          </Form>
        </div>
        )}
      </div>
    )
  }
}
