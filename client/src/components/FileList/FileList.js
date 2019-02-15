import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../../services/fileManager';

export default class FileList extends Component {
  state = {
    fileData : null,
  }
  //컴포넌트 로딩후 호출
  componentDidMount() {
    fileManagerService.getAllData().then((data) => {
      if (data) {
        this.setState({
          fileData: data.children
        })
      }
    });
  }

  makeFolderStructure = (array) => {
    if(array) {
      return (
      <ul>
      {array.map((item) => {
        return (
          <li key={item.path} className={item.type} >
            {item.name}
            {(item.children) ? this.makeFolderStructure(item.children) : '' }
          </li>
        )
      })}
      </ul>
      )
    }
  }

  render() {
    return (
      <div>
        {this.state.fileData ? this.makeFolderStructure(this.state.fileData) : '' }
      </div>
    )
  }
}
