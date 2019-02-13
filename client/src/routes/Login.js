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
      console.log(auth.msg);
      localStorage.setItem('userInfo', JSON.stringify(auth.msg));
      this.setState({});
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
    const user = localStorage.getItem('userInfo');
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  render() {
    const isAlreadyAuthentication = this.isAuthentication();
    return (
      <div>
      {isAlreadyAuthentication ? <Redirect to={{pathname: '/'}} /> : (
          <div className="Login">
          <Form>
            <FormGroup>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="이메일" 
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
