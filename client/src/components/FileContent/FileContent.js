import React, { Component } from 'react'

export default class FileContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    // 부모 FileManger 컴포넌트에게 받은 content데이터를 state에 할당
    this.setState({
      content: nextProps.content,
    })
  }

  changeContentHandler = (e) => {
    const {value} = e.target;
    this.setState({
      content: value
    })
  }

  render() {
    const content = this.state.content ? this.state.content : '';
    return (
      <div>
        <textarea value={content} onChange={this.changeContentHandler}>
        </textarea>
      </div>
    )
  }
}
