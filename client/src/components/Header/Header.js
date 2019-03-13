import React, { Component } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  NavLink,
  DropdownToggle,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Container,
  Badge,
  Alert
} from 'reactstrap';
import logo_img from '../../assets/images/logo.png';
import { logout, isAuthenticated } from './action';
import socketIOClient from 'socket.io-client';
import { SERVER_IP } from '../../config';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      isloggined: false,
      endpoint: SERVER_IP,
      socket: null,
      isUpdate: false,
      isOpen: false,
      visible: false,
      alertTimeout: null,
      privateMessage: null
    };
  }

  componentDidMount() {
    this.authenticatedHandler();
  }

  // 메시지 alert show toggle
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  // 메시지 alert 삭제 버튼
  onDismiss = () => {
    this.setState({ visible: false });
  };

  // 로그아웃
  logoutHandler = async () => {
    await logout();
    window.location.reload();
  };

  // 로그인 유무 리턴
  authCheck = () => {
    return isAuthenticated();
  };

  // 메시지도착했을때 alert창 timeout이벤트
  messageAlertShow = () => {
    clearTimeout(this.state.alertTimeout);
    this.setState({
      visible: true,
      alertTimeout: setTimeout(() => {
        this.setState({
          visible: false
        });
      }, 3000)
    });
  };

  // 메시지 도착시 localstorage 저장 및 변경
  messageLogcalStrageHandler = () => {
    if (!localStorage.getItem('message')) {
      localStorage.setItem('message', 1);
    } else {
      localStorage.setItem(
        'message',
        parseInt(localStorage.getItem('message')) + 1
      );
    }
  };

  componentDidUpdate() {
    //현재 state가 로그인된 상태에서만 적용

    if (this.state.isloggined) {
      // 로그인 유무 검사
      this.authCheck().then(auth => {
        // 로그아웃상태라면 state수정후
        if (!auth) {
          this.setState(
            {
              isloggined: false,
              username: null
            },
            () => {
              if (!this.state.isUpdate) {
                this.setState(
                  {
                    isUpdate: true
                  },
                  () => {
                    // 세션 만료시
                    alert('세션이 만료되어 로그아웃 처리됐습니다.');
                    window.location.reload();
                  }
                );
              }
            }
          );
        }
      });
    }
  }

  authenticatedHandler = async () => {
    // 로그인 유무 확인
    const check = await this.authCheck();
    if (check) {
      this.setState({
        isloggined: true,
        username: check.msg
      });

      const socket = socketIOClient(this.state.endpoint);
      // publicRoom 참여 check.msg = username
      socket.emit('enter public room', check.msg);
      socket.on('success public room', () => {
        // 모든 유저 정보 요청
        socket.emit('get all users');
      });

      // 모든 유저 정보 이벤트 연결
      socket.on('success get users', allUsers => {
        this.props.isLogginHandler(
          this.state.isloggined,
          this.state.username,
          allUsers,
          socket
        );
      });

      // 전체 채팅 이벤트 연결
      socket.on('public message', publicMessage => {
        //this.setState({publicMessage: publicMessage});
        this.props.receivePublicMessageHandler(publicMessage);
      });

      // 전체 채팅 내역
      socket.on('public all message', allMessage => {
        this.props.getPublicMessageHandler(allMessage);
      });

      // 귓속말 채팅 이벤트 연결
      socket.on('private message', privateMessage => {
        const currentUrl = window.location.href.split('/');
        if (currentUrl[currentUrl.length - 1] !== 'chat') {
          this.messageAlertShow();
          this.messageLogcalStrageHandler();
        }
        this.setState({ privateMessage: privateMessage });
        this.props.receiveprivateMessageHandler(privateMessage);
      });

      // 귓속말 내역
      socket.on('private get message', message => {
        this.props.getPrivateMessageHandler(message);
      });

      // 중복 로그인되어있는 상대에게
      socket.on('duplicated login', duplicatedIp => {
        logout();
        alert(duplicatedIp + ' 에서 로그인으로 인해 로그아웃 처리됩니다.');
      });

      // 로그인 한 상대에게
      socket.on('duplicated relogin', () => {
        logout();
        alert('중복로그인으로 인해 재접속해주시기 바랍니다.');
      });
    }
  };

  render() {
    const isAlreadyAuthentication = this.state.isloggined;
    const privateMessage = this.state.privateMessage;

    return (
      <div id="header">
        {/* 로그인 유무 판단 후 렌더링 */}
        {isAlreadyAuthentication ? (
          <Navbar light expand="md">
            <Container>
              <NavbarBrand href="/">
                <img src={logo_img} id="App-head-logo" alt="goorm_img" />
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      className="item headerText"
                      style={{ color: 'white' }}
                      to={`/fileManager/${this.state.username}`}
                    >
                      파일매니저
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      className="item headerText"
                      style={{ color: 'white' }}
                      to="/chat"
                    >
                      채팅
                      <Badge color="info" pill>
                        {localStorage.getItem('message')}
                      </Badge>
                    </NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      className="item headerText"
                      style={{ color: 'white' }}
                      nav
                      caret
                    >
                      정보
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem onClick={this.logoutHandler}>
                        로그아웃
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        ) : (
          <Navbar light expand="md">
            <Container>
              <NavbarBrand href="/">
                <img src={logo_img} id="App-head-logo" alt="goorm_img" />
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      className="item headerText"
                      style={{ color: 'white' }}
                      to="/login"
                    >
                      로그인
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      className="item headerText"
                      style={{ color: 'white' }}
                      to="/signup"
                    >
                      회원가입
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        )}
        {privateMessage ? (
          // 메시지 알림 창
          <Alert
            color="info"
            isOpen={this.state.visible}
            toggle={this.onDismiss}
          >
            <strong>{privateMessage.username}</strong> 님이 메시지를 보냈습니다.
            <span id="alert_margin" />[{privateMessage.message}]
          </Alert>
        ) : (
          ''
        )}
      </div>
    );
  }
}
