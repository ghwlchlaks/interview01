import React, { Component } from 'react'
import { Button, Input, Label, FormGroup, Form } from "reactstrap";

import './Signup.css';

export default class Login extends Component {
  render() {
    return (
      <div className="Login">
        <Form>
          <FormGroup>
            <Input type="email" name="email" id="exampleEmail" placeholder="이메일" />
          </FormGroup>
          <FormGroup>
            <Input type="password" name="password" id="examplePassword" placeholder="비밀번호" />
          </FormGroup>
          <FormGroup>
            <Input type="password" name="password1" id="examplePassword1" placeholder="비밀번호 확인" />
          </FormGroup>
          <Button id="SignupBtn">계정 만들기</Button>
        </Form>
      </div>
    )
  }
}
