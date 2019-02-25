import React, { Component } from 'react';
import { Button, Input, FormGroup, Form, Container } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import './Login.css';
import { login } from './action';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isloggined: props.isloggined,
      loginInfo: {
        username: '',
        password: ''
      }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isloggined !== prevState.isloggined) {
      return {
        isloggined: nextProps.isloggined
      };
    }
    return null;
  }

  // 로그인 버튼 이벤트
  loginHandler = async () => {
    const { username, password } = this.state.loginInfo;
    if (username === '' || password === '') {
      alert('입력칸을 모두 작성해주세요');
    } else {
      const auth = await login(this.state.loginInfo);
      if (auth.status) {
        window.location.reload();
      } else {
        this.setState({
          loginInfo: {
            username: '',
            password: ''
          }
        });
        alert(auth.msg.message);
      }
    }
  };

  // input 변경
  changeHandler = e => {
    const { name, value } = e.target;
    this.setState({
      loginInfo: {
        ...this.state.loginInfo,
        [name]: value
      }
    });
  };

  // 키이벤트
  keyPressHandler = e => {
    if (e.key === 'Enter') {
      this.loginHandler();
    }
  };

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.state.isloggined;

    return (
      <Container id="login">
        {/* 로그인 유무에 따른 리다이렉션 */}
        {isAlreadyAuthentication ? (
          <Redirect to={{ pathname: '/' }} />
        ) : (
          <Form>
            <FormGroup row>
              <Input
                value={this.state.loginInfo.username}
                id="username"
                placeholder="아이디"
                onChange={this.changeHandler}
                onKeyPress={this.keyPressHandler}
                name="username"
              />
            </FormGroup>
            <FormGroup row>
              <Input
                value={this.state.loginInfo.password}
                type="password"
                name="password"
                id="password"
                placeholder="비밀번호"
                onChange={this.changeHandler}
                onKeyPress={this.keyPressHandler}
              />
            </FormGroup>
            <FormGroup row>
              <Button id="loginBtn" onClick={this.loginHandler}>
                로그인
              </Button>
            </FormGroup>
          </Form>
        )}
      </Container>
    );
  }
}
