import React, { Component } from 'react'
import FileList from '../../components/FileList/FileList';
import FileContent from '../../components/FileContent/FileContent';
import './FileManager.css'
import {Container, Row, Col} from 'reactstrap'
import axios from 'axios'
import {Redirect} from 'react-router-dom';

export default class FileManager extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: props.match.params.username,
      selectFile: null,
      loaded: 0,
      fileData : {
        fileContent: null,
        path: null,
      }
    }
  }
  
  // 자식 filelist에서 클릭한 파일들에 대한 정보 받는 핸들러
  contentReceivedHandler = (fileData) => {
    this.setState({
      fileData : fileData
    })
  }

  // 파일 선택후 업로드 버튼 이벤트 핸들러
  uploadHandler = () => {
    if(this.state.selectFile) {
      const data = new FormData()
      data.append('file', this.state.selectFile, this.state.selectFile.name);

      axios.post('/api/fileManager/upload', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
          })
        }
      }).then((res) => {
        if (res.data) {
          alert('업로드 성공!');
          this.setState({
            selectFile: null,
            loaded: 0
          })
        }
      })
    } else {
      alert('업로드할 파일을 선택해주세요');
    }
  }

  changeUploadFile = (e) => {
    this.setState({
      selectFile: e.target.files[0],
      loaded: 0
    })
  }

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    const username = this.state.username;

    return (
    <div>
      {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}} /> : (
        <div>
          {username}
        <Container>
        <Row>
          {/* 1. 자식 FileList에서 클릭한 파일의 데이터를 받아옴 */}
          <Col className="left" xs="4"><FileList sendContentHandler={this.contentReceivedHandler}></FileList></Col>
          {/* 2. 받아온 FileList의 값을 자식인 FileContent컴포넌트에게 전달 */}
          <Col className="right" xs="8"><FileContent fileData={this.state.fileData}></FileContent></Col>
        </Row>
      </Container>
      <input type='file' accept=".zip, .tar" onChange={this.changeUploadFile} />
      <button onClick={this.uploadHandler}>업로드</button>
      <div> {Math.round(this.state.loaded, 2)}</div>
      </div>
      )}
      </div>
    )
  }
}
