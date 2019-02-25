import React, { Component } from 'react';
import { updateFile } from '../action';
import { Button, FormGroup, Input } from 'reactstrap';
import './FileContent.css';

export default class FileContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileData: {
        fileContent: null,
        path: null
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // 부모 FileManger 컴포넌트에게 받은 content데이터를 state에 할당
    this.setState({
      fileData: nextProps.fileData
    });
  }

  //textarea값이 변경되었을때
  changeContentHandler = e => {
    const modifyContent = e.target.value;
    this.setState({
      fileData: {
        ...this.state.fileData,
        fileContent: modifyContent
      }
    });
  };

  // 파일 내용 수정 후 저장 이벤트
  saveClickHandler = async () => {
    const result = await updateFile(this.state.fileData);
    if (result) {
      alert('성공적으로 저장되었습니다.');
    } else {
      alert('저장에 실패하였습니다.');
    }
  };

  render() {
    const content = this.state.fileData.fileContent
      ? this.state.fileData.fileContent
      : '';
    return (
      <div>
        <FormGroup>
          <Input
            type="textarea"
            name="text"
            id="fileContent"
            value={content}
            onChange={this.changeContentHandler}
          />
        </FormGroup>
        <FormGroup>
          <Button
            id="save_button"
            color="secondary"
            onClick={this.saveClickHandler}
          >
            저장
          </Button>
        </FormGroup>
      </div>
    );
  }
}
