import React, { Component } from 'react';
import FileList from './FileList/FileList';
import FileContent from './FileContent/FileContent';
import Controller from './Controller/Controller';
import './FileManager.css';

import { Container, Row, Col, FormGroup } from 'reactstrap';
import { Redirect } from 'react-router-dom';

export default class FileManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.match.params.username,
      isloggined: props.isloggined,
      isSuccessUpload: false,
      fileData: {
        fileContent: null,
        path: null
      }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isloggined !== prevState.isloggined) {
      return {
        isloggined: nextProps.isloggined
      };
    }
    return null;
  }

  // 자식 filelist에서 클릭한 파일들에 대한 정보 받는 핸들러
  contentReceivedHandler = fileData => {
    this.setState({
      fileData: fileData
    });
  };

  // 파일업로드 성공 유무를 받는 핸들러
  getSuccessUploadHandler = isSuccessUpload => {
    this.setState({
      isSuccessUpload: isSuccessUpload
    });
  };

  render() {
    const isAlreadyAuthentication = this.state.isloggined;
    const username = this.state.username;

    return (
      <Container>
        {isAlreadyAuthentication ? (
          <Row>
            {/* 1. 자식 FileList에서 클릭한 파일의 데이터를 받아옴 */}
            <Col className="left" sm="4" xs="12">
              <FormGroup row>
                <Controller
                  isSuccessUpload={this.isSuccessUpload}
                  getSuccessUploadHandler={this.getSuccessUploadHandler}
                />
              </FormGroup>

              <Row id="fileList">
                <FileList
                  username={username}
                  {...this.props}
                  isSuccessUpload={this.state.isSuccessUpload}
                  sendContentHandler={this.contentReceivedHandler}
                />
              </Row>
            </Col>

            {/* 2. 받아온 FileList의 값을 자식인 FileContent컴포넌트에게 전달 */}
            <Col className="right" sm="8" xs="12">
              <FileContent id="fileContent" fileData={this.state.fileData} />
            </Col>
          </Row>
        ) : (
          <Redirect to="/" />
        )}
      </Container>
    );
  }
}
