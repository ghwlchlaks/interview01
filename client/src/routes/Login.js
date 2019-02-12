import React, { Component } from 'react'
import { Button, Input, FormGroup, Form } from "reactstrap";

import './Login.css';

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
          <Button id="LoginBtn">로그인</Button>
        </Form>
      </div>
    )
  }
}
