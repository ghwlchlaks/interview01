import React, { Component } from 'react'
import './ChatList.css';

export default class ChatList extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      publicAllMsg: props.publicAllMsg,
      username: props.username,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // 메시지 변경되었을떄
    if (nextProps.publicAllMsg !== prevState.publicAllMsg) {
      return {
        publicAllMsg: nextProps.publicAllMsg
      }
    }

    if (nextProps.username !== prevState.username) {
      return {
        username: nextProps.username
      }
    }

    return null;
  }

  makePublicChatList = (list) => {
    if (list) {
      return (
        list.map((item) => {
          return this.distinctMsg(item)
        })
      )
    }
  }

  
  distinctMsg = (item) => {
    const {_id, username, sender, message, createdDate} = item;
    // username = 송신자 , this.state.username = 현재 나의 계정 
    if (username !== this.state.username) {
      // 내가 보낸것이 아니라면
      return (
      <div className="incoming_msg chat_content" key={_id}>
        <div className="received_msg">
          <div className="received_withd_msg">
            <strong>{username}</strong>
            <p>{message}</p>
            <span className="tiem_date">{createdDate}</span>
          </div>
        </div>
      </div>
      )
    } else {
      // 내가 보낸것이라면
      return (
      <div className="outgoing_msg chat_content" key={_id}>
        <div className="sent_msg">
          <p>{message}</p>
          <span className="tiem_date">{createdDate}</span>
        </div>
      </div>
      )
    }
  }


  render() {
    const publicAllMsg = this.state.publicAllMsg;
    return (
      <div id="chat_ul">
        {
          publicAllMsg ? 
          this.makePublicChatList(publicAllMsg): ''
        }
      </div>
    )
  }
}
