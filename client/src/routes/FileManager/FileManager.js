import React, { Component } from 'react'
import FileList from '../../components/FileList/FileList';
import FileContent from '../../components/FileContent/FileContent';
import './FileManager.css'
import {Container, Row, Col, FormGroup, CustomInput, Button, Progress } from 'reactstrap'
import axios from 'axios'
import {Redirect} from 'react-router-dom';

export default class FileManager extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: props.match.params.username,
      fileName: 'Choose file',
      selectFile: null,
      isSuccessUpload: false,
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

      window.document.getElementById('upload_input').classList.toggle('disabled');
      window.document.getElementById('upload_button').classList.toggle('disabled');

      this.setState({
        loaded: 0
      })

      axios.post('/api/fileManager/upload', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
          })
        }
      }).then((res) => {
        if (res.data) {
          window.document.getElementById('upload_input').classList.toggle('disabled');
          window.document.getElementById('upload_button').classList.toggle('disabled');
          this.setState({
            selectFile: null,
            isSuccessUpload: !this.state.isSuccessUpload,
            fileName: 'Choose file'
          })
          
        } else {
          alert('로그인이 필요합니다.');
        }
      })
    } else {
      alert('업로드할 파일을 선택해주세요');
    }
  }

  changeUploadFile = (e) => {
    
    const files = e.target.files[0];
    if (!files) {
      this.setState({
        fileName: 'Choose file',
      })
    } else {
      this.setState({
        fileName: files.name,
        selectFile: files,
        loaded: 0
      })
    }
  }

  render() {
    // App.js에서 전달받은 로그인 유무
    const isAlreadyAuthentication = this.props.isloggined
    const username = this.state.username;
    return (
    <Container>
      {!isAlreadyAuthentication ? <Redirect to={{pathname: '/'}} /> : (
        <Row>
          
          {/* 1. 자식 FileList에서 클릭한 파일의 데이터를 받아옴 */}
          <Col className="left" sm="4" xs="12">
            <FormGroup row>
                <CustomInput 
                  id="upload_input" 
                  type="file" 
                  accept=".zip, .tar" 
                  onChange={this.changeUploadFile} 
                  label={this.state.fileName} 
                  />
                <Button 
                  id="upload_button" 
                  size="sm" 
                  color="secondary"
                  onClick={this.uploadHandler}>
                  업로드
                </Button>
                <Progress 
                  striped 
                  color="success" 
                  value={(this.state.loaded)} 
                />
            </FormGroup>
 
            <Row id="fileList">
              <FileList  
                username={username} 
                {...this.props} 
                isSuccessUpload={this.state.isSuccessUpload} 
                sendContentHandler={this.contentReceivedHandler}>
              </FileList>
            </Row>

          </Col>

          {/* 2. 받아온 FileList의 값을 자식인 FileContent컴포넌트에게 전달 */}
          <Col className="right" sm="8" xs="12">
            <FileContent 
              id="fileContent" 
              fileData={this.state.fileData}>
            </FileContent>
          </Col>
        </Row>
      )}
      </Container>
    )
  }
}
