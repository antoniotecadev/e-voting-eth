import "./App.css";
import getWeb3 from "./getWeb3";
import React, { Component, useState, useEffect } from "react";
import logo from './logo.png';
import Home from './components/Home';
import Registo from './components/Registo';
import Urna from './components/Urna';
import Estado from './components/Estado';
import 'bootstrap/dist/css/bootstrap.min.css';
import Eleicao from "./contracts/Eleicao.json";
import { Switch, Route, Link } from "react-router-dom";
import {Container, Navbar, Nav, Toast, Col, Row, Spinner, ToastContainer} from 'react-bootstrap';


export default class App extends Component {
  
  constructor(props){
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
    this.ouvirEventos = this.ouvirEventos.bind(this);
    this.registarEleitor = this.registarEleitor.bind(this);
    
    this.state = { 
      alertShow: false,
      alertSuccess: false, 
      web3: null, 
      accounts: null, 
      contract: null,
      nome: null,
      bi: null,
      endereco: null,
      toast: false,
      toastMessage: null,
      numeroEleitores: 0, 
    };
  }

  timeOut = () => {
    setTimeout(() => {
      this.setState({toast: false});
    }, 3000);
  }
  
  registarEleitor = async (nome, bi, endereco) => {
    if(bi.length < 14) {  
      this.setState({toast: true, toastMessage: 'Bilhete de identidade inválido.'});
      this.timeOut();
    } else if(!this.state.web3.utils.isHexStrict(endereco) || !this.state.web3.utils.isAddress(endereco)) {
      this.setState({toast: true, toastMessage: 'Endereço inválido.'});
      this.timeOut();
    } else {
      const r = window.confirm("Registar ?" + "\n" + nome + "\n" + bi +"\n"+ endereco);
      if(r){
        try{
          await this.state.contract.methods.registarEleitor(nome, bi, endereco).send({from: this.state.accounts[0]});
        }catch(error){
          alert("ERRO ! Registo não efectuado");
        }
      }
    }
  }

  componentDidMount = async () => {

    try {

      // Obter o provedor de rede e a instância web3.
      const web3 = await getWeb3();

      // Usar web3 para obter as contas do usuário.
      const accounts = await web3.eth.getAccounts();

      // Obter a instância do contrato.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Eleicao.networks[networkId];
      const instance = new web3.eth.Contract(
        Eleicao.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Falha ao carregar web3, contas ou contrato. Verifique o console para obter detalhes.`,
      );
      console.error(error);
    }
    this.ouvirEventos();
  };

  // componentDidUpdate

  ouvirEventos() {
    this.state.contract.events.Registado({})
      .on('data', (event) => {
        this.showAlert(true, event.returnValues[0], event.returnValues[1], event.returnValues[2])
    })
    .on('error', (event) =>{
      alert('ERRO! Registo não efectuado');
      console.log(event.returnValues);
    });
  }

  runExample = async () => {
    this.setState({numeroEleitores: await this.state.contract.methods.numeroEleitores().call()});
  };

  showAlert(isSuccess, _nome, _bi, _endereco) {
    this.setState({alertShow: true, alertSuccess: isSuccess, nome: _nome, bi: _bi, endereco: _endereco});
  }

  closeAlert() {
    this.setState({alertShow: false});
  }

  render() {
    
    if (!this.state.web3) {
      return <Spinner animation="border" variant="primary" />
    }
    return (
        <NavBar registar = {this.registarEleitor} fecharAlert = {this.closeAlert} {...this.state}/>
    );
  }

}

const NavBar = (props) => {
  return (
  <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
              <Nav.Item>
                  <Nav.Link href="/home" as={Link} to="/">
                      <img
                      alt=""
                      src={logo}
                      width="100"
                      height="100"
                      className="d-inline-block"
                      />
                  <p class="fw-bolder mx-1 text-light text-muted">VOTECA</p>
                  </Nav.Link>
              </Nav.Item>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto" variant="pills">
                  <Nav.Item>
                      <Nav.Link href="/home" as={Link} to="/" eventKey = "link1">INÍCIO</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link href="/registo"as={Link} to="/registo" eventKey = "link2">REGISTO</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link href="/urna"as={Link} to="/urna" eventKey = "link3">URNA</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link href="/estado"as={Link} to="/estado" eventKey = "link4">ESTADO</Nav.Link>
                  </Nav.Item>
              </Nav>
              <Nav>
                  <Nav.Link>End.</Nav.Link>
                      <Nav.Link eventKey={2}>
                          {props.accounts}
                      </Nav.Link>
              </Nav>
          </Navbar.Collapse>
          </Container>
      </Navbar>

      <Switch>
          <Route path="/registo">
              { props.toast && <ToastWarning mensagem = {props.toastMessage} /> }
              <Registo contract = {props.contract} accounts = {props.accounts} registar = {props.registar} alertRegisto = {props.alertShow} fecharAlert = {props.fecharAlert} alertSuccess = {props.alertSuccess} nome = {props.nome} bi = {props.bi} endereco = {props.endereco}/>
          </Route>
          <Route path="/urna">
              <Urna contract={props.contract} accounts={props.accounts}/>
          </Route>
          <Route path="/estado">
              <Estado contract={props.contract} web3 = {props.web3}/>
          </Route>
          <Route exact path="/">
              <Home contract={props.contract} />
          </Route>
      </Switch>
  </>
);
}

function ToastWarning(props) {

  const [show, setShow] = useState(true);

  return (
    <Row>
      <Col xs={6}>
      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg = "warning">
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Falha!</strong>
          </Toast.Header>
          <Toast.Body>{props.mensagem}</Toast.Body>
        </Toast>
      </ToastContainer>
      </Col>
    </Row>
  );
}


