import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../../services/fileManager';

export default class FileList extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    allFileData : null,
    fileData : {
      fileContent: null,
      path: null,
    }
  }
  //컴포넌트 로딩후 호출
  componentDidMount() {
    this.getAllFileData();
  }

  //모든 파일 데이터 가져오기
  getAllFileData = () => {
    fileManagerService.getAllData().then((data) => {
      if (data) {
        this.setState({
          allFileData: data.children
        })
      }
    });

  
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isSuccessUpload !== this.props.isSuccessUpload) {
      this.getAllFileData()
    }
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
      <ul className="nested">
      {array.map((item) => {
        return (
          /* 폴더 구조 리스트 생성 및 click 이벤트로 item.path값 바인드*/
          <li key={item.path} className={item.type}>
          {
            item.type === 'file' ? (<a onClick={this.listClickHandler.bind(this, item.path)}>{item.name}</a>) : 
            (<span onClick={this.bindDictionaryEvent.bind(this)} className="caret">{item.name}</span>)
          }
          
            {(item.children) ? this.makeFolderStructure(item.children) : '' }
          </li>
        )
      })}
      </ul>
      )
    }
  }

  bindDictionaryEvent (e) {
    e.target.parentElement.querySelector(".nested").classList.toggle("active");
    e.target.classList.toggle("caret-down");
  }

  render() {
    const username = this.props.username
    const allFileData = this.state.allFileData
    return (
        <ul id="myUL">
        {allFileData ? (
          <li><span onClick={this.bindDictionaryEvent} className="caret">{username}</span>
            {
              allFileData ? this.makeFolderStructure(allFileData) : ''
            }
          </li>
          ) : (
            <li><span className="caret">{username}</span></li>
          )}
        </ul>

    )
  }
}
