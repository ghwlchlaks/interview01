import React, { Component } from 'react';
import './Home.css';
import { Card, CardImg, CardBody, CardTitle, CardLink } from 'reactstrap';
import page_img from '../../assets/images/page.png';

export default class home extends Component {
  render() {
    return (
      <div id="home">
        <Card>
          <CardBody>
            <CardTitle>페이지 구성도</CardTitle>
            <CardLink
              target="_blank"
              href="https://github.com/ghwlchlaks/interview01"
            >
              GitHub Link
            </CardLink>
          </CardBody>
          <CardImg top width="60%" src={page_img} alt="Card image cap" />
        </Card>
      </div>
    );
  }
}
