import React, { Component } from 'react'
import FileList from './FileList/FileList';
import FileContent from './FileContent/FileContent';
import Controller from './Controller/Controller';
import './FileManager.css'

import {Container, Row, Col, FormGroup } from 'reactstrap'
import {Redirect} from 'react-router-dom';


export default class FileManager extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: props.match.params.username,
      isSuccessUpload: false,
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
  
  getSuccessUploadHandler = (isSuccessUpload) => {
    this.setState({
      isSuccessUpload: isSuccessUpload
    })
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
                <Controller
                  isSuccessUpload={this.isSuccessUpload}
                  getSuccessUploadHandler={this.getSuccessUploadHandler}
                ></Controller>
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
