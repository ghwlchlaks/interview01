import React, { Component } from 'react'
import './UserList.css';

export default class UserList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allUsers: props.allUsers,
      username: props.username,
      socket: props.socket,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.allUsers !== prevState.allUsers) {
      return {
        allUsers: nextProps.allUsers,
      }
    }

    if (nextProps.username !== prevState.username) {
      return {
        username: nextProps.username,
      }
    }

    if (nextProps.socket !== prevState.socket) {
      return {
        socket: nextProps.socket
      }
    }

    return null;
  }

  // 유리 리스트 클릭이벤트
  userListClickHandler = (e) => {
    const beforeActiveTag = document.getElementsByClassName('list-group-item active')[0]
    if (beforeActiveTag) {
      const afterActiveTag = e.target;
      if (afterActiveTag.id !== this.state.activeUserList) {
        beforeActiveTag.classList.toggle('active')
        
        afterActiveTag.classList.toggle('active');
        this.setState({
          activeUserList: afterActiveTag.id
        }, () => {
          this.props.receiveActiveUser(this.state.activeUserList)
          const from = this.props.username
          const to = this.state.activeUserList
          if ( to === 'public') {
            // 전체 채팅 가져오기
            this.state.socket.emit('get public message', from);
          } else {
            // from 과 to의 채팅 가져오기
            this.state.socket.emit('get private message', from, to)
          }
      })
    }
    }
  }
  
  // 유저리스트 동적 생성
  makeUserList = (allUsers) => {
    if (allUsers) {
      return (
        allUsers.map((user) => {
          if (user.username !== this.state.username) {
            return (         
              <li 
                key={user.socketId} 
                onClick={this.userListClickHandler} 
                id={user.username} 
                className="list-group-item">
                {user.username}
              </li>
            )
          }
        })
      )
    }
  }

  render() {
    const allUsers = this.state.allUsers;

    return (
      <div id="userlist_ui">
        <div className="panel panel-info">
          <ul className="list-group">
              <li 
                onClick={this.userListClickHandler} 
                id="public" 
                className="list-group-item active">
                전체
                </li>
              {
                allUsers ? 
                this.makeUserList(allUsers) : ''
              }
          </ul>
      </div>
    </div>
    )
  }
}
