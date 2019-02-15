import React, { Component } from 'react'
import FileList from '../components/FileList';

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
        <FileList></FileList>
        {this.state.username}
      </div>
    )
  }
}
