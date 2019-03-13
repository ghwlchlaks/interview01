import React, { Component } from 'react';
import './Footer.css';

export default class Footer extends Component {
  render() {
    return (
      <div id="footer">
        <div className="row no-gutters social-container">
          <div className="col">
            <a className="social-inner" href="https://github.com/ghwlchlaks/">
              <span>Github</span>
            </a>
          </div>
          <div className="col">
            <a className="social-inner" href="https://ghwlchlaks.github.io/">
              <span>Blog</span>
            </a>
          </div>
          <div className="col">
            <a className="social-inner" href="https://disqus.com/by/JihoDev/">
              <span>Comment</span>
            </a>
          </div>
          <div className="col">
            <a className="social-inner" href="mailto:ghwlchlaks@gmail.com">
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
