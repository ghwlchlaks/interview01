import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../../services/fileManager';

export default class FileList extends Component {
  state = {
    allFileData : null,
    fileData : {
      fileContent: null,
      path: null,
    }
  }
  //컴포넌트 로딩후 호출
  componentDidMount() {
    fileManagerService.getAllData().then((data) => {
      if (data) {
        this.setState({
          allFileData: data.children
        })
      }
    });
  }

  // 리스트 클릭 이벤트
  listClickHandler = (path ,e) => {
    fileManagerService.readFile(path).then((content) => {
      this.setState({
        fileData : {
          fileContent: content,
          path: path,
        }
      }, function() {
        // 부모컴포넌트인 Filemanager로 content값 전달
        this.props.sendContentHandler(this.state.fileData);
      })
    })
  }

  //렌더링
  makeFolderStructure = (array) => {
    if(array) {
      return (
      <ul>
      {array.map((item) => {
        return (
          /* 폴더 구조 리스트 생성 및 click 이벤트로 item.path값 바인드*/
          <li key={item.path} className={item.type}>
            {
              item.type === 'file' ? 
              (<a  onClick={this.listClickHandler.bind(this, item.path)}>{item.name}</a>)
              : (<a>{item.name}</a>)
            }
          
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
      <div className="tree">
        {this.state.allFileData ? this.makeFolderStructure(this.state.allFileData) : '' }
      </div>
    )
  }
}
