import React, { Component } from 'react';
import './Controller.css';
import { CustomInput, Button, Container, Progress } from 'reactstrap';
import axios from 'axios';

export default class Controller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSuccessUpload: props.isSuccessUpload,
      fileName: 'Choose file',
      selectFile: null,
      loaded: 0
    };
  }

  // 업로드 파일 변경 이벤트
  changeUploadFile = e => {
    const files = e.target.files[0];
    if (!files) {
      this.setState({
        fileName: 'Choose file'
      });
    } else {
      this.setState({
        fileName: files.name,
        selectFile: files,
        loaded: 0
      });
    }
  };

  // 파일 선택후 업로드 버튼 이벤트 핸들러
  uploadHandler = () => {
    if (this.state.selectFile) {
      const data = new FormData();
      data.append('file', this.state.selectFile, this.state.selectFile.name);

      window.document
        .getElementById('upload_input')
        .classList.toggle('disabled');
      window.document
        .getElementById('upload_button')
        .classList.toggle('disabled');

      this.setState({
        loaded: 0
      });

      axios
        .post('/api/fileManager/upload', data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(res => {
          if (res.data) {
            window.document
              .getElementById('upload_input')
              .classList.toggle('disabled');
            window.document
              .getElementById('upload_button')
              .classList.toggle('disabled');
            this.setState(
              {
                selectFile: null,
                isSuccessUpload: !this.state.isSuccessUpload,
                fileName: 'Choose file'
              },
              () => {
                this.props.getSuccessUploadHandler(this.state.isSuccessUpload);
              }
            );
          } else {
            alert('로그인이 필요합니다.');
          }
        });
    } else {
      alert('업로드할 파일을 선택해주세요');
    }
  };

  render() {
    const fileName = this.state.fileName;
    const loaded = this.state.loaded;

    return (
      <div>
        <CustomInput
          id="upload_input"
          type="file"
          accept=".zip, .tar"
          onChange={this.changeUploadFile}
          label={fileName}
        />
        <Button
          id="upload_button"
          size="sm"
          color="secondary"
          onClick={this.uploadHandler}
        >
          업로드
        </Button>
        <Container id="progressbar">
          <Progress striped color="success" value={loaded} />
        </Container>
      </div>
    );
  }
}
