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

  componentWillReceiveProps(nextProps) {
    if (nextProps.allUsers !== this.state.allUsers) {
      this.setState({
        allUsers: nextProps.allUsers,
      })
    }

    if (nextProps.username !== this.state.username) {
      this.setState({
        username: nextProps.username,
      })
    }

    if (nextProps.socket !== this.state.socket) {
      this.setState({
        socket: nextProps.socket
      })
    }
  }

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
    )
  }
}
