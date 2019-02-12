import React, { Component } from 'react'

export default class FileManager extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: props.match.params.username
    }
  }
  render() {
    return (
      <div>
        {this.state.username}
      </div>
    )
  }
}
