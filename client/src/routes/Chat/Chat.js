import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import './Chat.css';

export default class Chat extends Component {
  render() {
    const logged = false;
    return (

      <div className="col-md-6 col-md-offset-3">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <span className="glyphicon glyphicon-comment"></span> Chat
          </div>
          <div className="panel-body">
            <ul className="chat"> </ul>
          </div>
          <div className="panel-footer">
            <div className="input-group">
              <input id="Mensaje" type="text" className="form-control input-sm" placeholder="Escribe un mensaje..." />
              <span className="input-group-btn">
                <button className="btn btn-warning btn-sm" id="btnEnviar">전송</button>
              </span>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
