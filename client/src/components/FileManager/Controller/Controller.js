import React, { Component } from 'react';
import './Controller.css';
import { CustomInput, Button, Container, Progress } from 'reactstrap';
import axios from 'axios';
import { duplicateFile } from '../action';

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
  uploadHandler = async () => {
    if (this.state.selectFile) {
      const isExist = await duplicateFile(this.state.selectFile.name);
      let isContinueWord;
      if (isExist.stats === false) {
        alert('로그인 필요합니다.');
        return;
      }
      if (isExist.status) {
        // 중복된 파일 없음, 업로드 가능
        isContinueWord =
          '압축해제한 파일경로중에 동일한 파일명이 있다면 덮어쓰여집니다 \n 계속하시겠습니까?';
      } else {
        // 중복된 파일 있음
        isContinueWord =
          '압축 파일 이름이 동일한 이력이 존재합니다. \n 계속하시겠습니까?';
      }

      const isContinue = window.confirm(isContinueWord);
      if (isContinue) {
        // 확인 클릭했을때 업로드 실행 파일 id값 넘기기 없는 파일이면 null
        this.upload(isExist.id);
      }
    } else {
      alert('업로드할 파일을 선택해주세요');
    }
  };

  upload = id => {
    const data = new FormData();
    data.append('file', this.state.selectFile, this.state.selectFile.name);
    data.append('id', id);

    window.document.getElementById('upload_input').classList.toggle('disabled');
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
        } else if (res.data.stats === false) {
          alert('로그인이 필요합니다.');
        }
      });
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
