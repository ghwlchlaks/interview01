import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../../services/fileManager';

export default class FileList extends Component {
  state = {
    fileData : null,
    fileContent: null,
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

  listClickHandler = (path ,e) => {
    // console.log(path);
    fileManagerService.readFile(path).then((content) => {
      this.setState({
        fileContent: content
      })
      // 부모컴포넌트인 Filemanager로 content값 전달
      this.props.sendContentHandler(content);
    })
  }

  makeFolderStructure = (array) => {
    if(array) {
      return (
      <ul>
      {array.map((item) => {
        return (
          /* 폴더 구조 리스트 생성 및 click 이벤트로 item.path값 바인드*/
          <li key={item.path} className={item.type} onClick={this.listClickHandler.bind(this, item.path)}>
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
