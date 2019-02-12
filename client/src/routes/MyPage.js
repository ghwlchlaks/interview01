import React, { Component } from "react";
import {Redirect} from 'react-router-dom';

export default class MyPage extends Component {
  render() {
    const logged = false;
    return (
    <div>
        {
          !logged && <Redirect  to="/login"/>
        }
        마이페이지
    </div>
    )
  }
}
