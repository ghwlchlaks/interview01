import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../services/fileManager';

export default class FileList extends Component {
  state = {
    fileData : []
  }
  //컴포넌트 로딩후 호출
  componentDidMount() {
    fileManagerService.getAllData().then((data) => this.setState({fileData: data}));
  }
  render() {
    console.log(this.state.fileData);
    return (
      <div>
      </div>
    )
  }
}
