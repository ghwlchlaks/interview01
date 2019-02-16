import React, { Component } from 'react'
import {updateFile} from "../../services/fileManager";

export default class FileContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileData : {
        fileContent: null,
        path: null,
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    // 부모 FileManger 컴포넌트에게 받은 content데이터를 state에 할당
    this.setState({
      fileData : nextProps.fileData,
    })
  }

  changeContentHandler = (e) => {
    const modifyContent = e.target.value;
    this.setState({
      fileData: {
        ...this.state.fileData,
        fileContent: modifyContent,
      }
    })
  }

  saveClickHandler = () => {
    const updateData = {
      path : this.state.path,
      data : this.state.content
    }
    console.log(updateData)
    // updateFile()
  }  

  render() {
    const content = this.state.fileData.fileContent ? this.state.fileData.fileContent : '';
    return (
      <div>
        <textarea value={content} onChange={this.changeContentHandler}>
        </textarea>
        <button onClick={this.saveClickHandler}>저장</button>
      </div>
    )
  }
}
