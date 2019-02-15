import React, { Component } from 'react'
import FileList from '../../components/FileList/FileList';
import FileContent from '../../components/FileContent/FileContent';
import './FileManager.css'
import {Container, Row, Col} from 'reactstrap'
import * as fileManagerService from '../../services/fileManager';
import axios from 'axios'

export default class FileManager extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: props.match.params.username,
      selectFile: null,
      loaded: 0
    }
  }

  componentDidMount() {
  }

  // uploadHandler = async() => {
  //   if(this.state.selectFile) {
  //     const data = new FormData()
  //     data.append('file', this.state.selectFile, this.state.selectFile.name);

  //     const result = await fileManagerService.upload(data, )
  //     console.log(result);
  //   } else {
  //     alert('업로드할 파일을 선택해주세요');
  //   }
  // }

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
    return (
      
    <div>
        {this.state.username}

      <Container>
        <Row>
          <Col className="left" xs="4"><FileList></FileList></Col>
          <Col className="right" xs="8"><FileContent></FileContent></Col>
        </Row>
      </Container>

      <input type='file' accept=".zip, .tar" onChange={this.changeUploadFile} />
      <button onClick={this.uploadHandler}>업로드</button>
      <div> {Math.round(this.state.loaded, 2)}</div>
    </div>
    )
  }
}
