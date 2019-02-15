import React, { Component } from 'react'
import './FileList.css';
import * as fileManagerService from '../../services/fileManager';
import './FileList.css';
export default class FileList extends Component {
  state = {
    fileData : ["abc/def/test.txt", "abc/def/test1.txt", "abc/ghi/test2.txt", "test4.txt"]
  }
  //컴포넌트 로딩후 호출
  componentDidMount() {
    // fileManagerService.getAllData().then((data) => this.setState({fileData: data}));
  }

  makeFolderStructure = (path) => {
    const pathSplit = path.split('/');
    pathSplit.forEach((value, index) => {
      return value
    })
  }

  render() {
    // console.log(this.state.fileData);
    return (
      <div>
        {this.state.fileData.map((path, pathIndex) => {
          // this.makeFolderStructure(path);
          const pathSplit = path.split('/');
          pathSplit.map((file, fileIndex) => {
            
          })
        })}
      </div>
    )
  }
}

/* 
1. li의 아이디 값으로 경로를 가져야한다. 수정 용도 
*/

{/* 
<ul>
  <li> dir1</li>
  <ul>
    <li>subdir1</li>
    <ul>
      <li>file3</li>
      <li>file5</li>
    </ul>
    <li> file2</li>
  </ul>
  <li>file1</li>
</ul> 
*/}