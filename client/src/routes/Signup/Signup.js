import React, { Component } from 'react'
import { Button, Input, ButtonGroup, FormGroup, Form } from "reactstrap";
import {Redirect} from 'react-router-dom';

import './Signup.css';
import * as authService from "../../services/auth";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signupInfo : {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: true
      }
    }

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
  }

  changeHandler = (e) => {
    const {name, value} = e.target;
    this.setState({
      signupInfo: {
        ...this.state.signupInfo,
        [name]: value
      }
    })
  }

  onRadioBtnClick = (sex) => {
    this.setState({
      signupInfo: {
        ...this.state.signupInfo,
        sex: sex
      }
    })
  }

  signupHandler = async() => {
    const {username, email, password, confirmPassword, sex} = this.state.signupInfo;
    
    //empty check
    if(password === confirmPassword) {
      if (username && email && password && confirmPassword && sex !== undefined) {
        const auth = await authService.signup(this.state.signupInfo);
        if(auth.status) {
          alert('회원가입 성공');
          this.props.history.push('/login');
        } else {
          this.setState({
            signupInfo: {
              ...this.state.signupInfo,
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }
          })
          alert(auth.msg.message)
        }
        return;
      }
      alert('모두 입력해주세요')
      return;
    }
    alert('비밀번호가 맞지 않습니다.')
    return;
  }

  keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.signupHandler();
    }
  }

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    return (
      <div className="Login">
      {/* 로그인 유무에 따른 리다이렉션 */}
      {isAlreadyAuthentication ? <Redirect to={{pathname: '/'}} /> : (
          <Form>
          <FormGroup>
            <Input value={this.state.signupInfo.username} type="text" name="username" id="username" onChange={this.changeHandler} onKeyPress={this.keyPressHandler} placeholder="아이디" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.signupInfo.email} type="email" name="email" id="email" onChange={this.changeHandler} onKeyPress={this.keyPressHandler} placeholder="이메일" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.signupInfo.password} type="password" name="password" id="password" onChange={this.changeHandler} onKeyPress={this.keyPressHandler} placeholder="비밀번호" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.signupInfo.confirmPassword} type="password" name="confirmPassword" id="confirmPassword" onChange={this.changeHandler} onKeyPress={this.keyPressHandler} placeholder="비밀번호 확인" />
          </FormGroup>
          <ButtonGroup>
          <Button color="primary" onClick={() => this.onRadioBtnClick(true)} active={this.state.signupInfo.sex === true}>남</Button>
          <Button color="primary" onClick={() => this.onRadioBtnClick(false)}  active={this.state.signupInfo.sex === false}>여</Button>
        </ButtonGroup>
          <Button id="signupBtn" onClick={this.signupHandler}>계정 만들기</Button>
        </Form>
        )}
      </div>
    )
  }
}
