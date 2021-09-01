import React from 'react';
import GenericComponent from "../common/genericComponent";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';

import LoginAPI from './loginAPI';
import SecurityContext from './securityContext'


class Login extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = LoginAPI;
    this.setState({redirect : null})
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async componentDidMount() {
    this.setState({ dto: {username: "", password: ""}})
  }

  handleChange(event) {
    const dto = this.state.dto;
    const id = event.target.id;
    
    if (id === "login.username"){
      dto.username=event.target.value;      
    } else if (id === "login.password") {      
      dto.password = event.target.value;
    }
    
    this.setState({dto: dto});
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ alert: null })
    const dto = this.state.dto;

    SecurityContext.login(dto).then(
      (result) => {
        if (result) {
          this.setState({redirect : '/venta'});
          window.location.reload();
        } else {
          this.setState({
            alert: (
            <Alert key="0" variant="danger">
              El usuario o la contrasena son incorrectos.
            </Alert>)
          })
          console.log("Request failed: " + JSON.stringify(result));
        }
      });
  }

  handleHideModal() {
    this.setState({
      showModal: false
    })
  }  

  render() {
    const { alert, redirect } = this.state;
    if (redirect) {
      return <Redirect to={redirect} />
    }
    if (SecurityContext.getPrincipal()) {
      return <Redirect to="/rubro" />
    } 

    return (
      <Row className="justify-content-md-center">
        <Form controlId="login">
          {alert}
          <Form.Group as={Row} >
          <Form.Label column sm="2">Usuario</Form.Label>
            <Col sm="10">
              <Form.Control id="login.username" type="text" placeholder="Enter email" onChange={this.handleChange}/>
            </Col>
          </Form.Group>

          <Form.Group as={Row} >
          <Form.Label column sm="2">Password</Form.Label>
            <Col sm="10">
              <Form.Control  id="login.password" type="password" placeholder="Password" onChange={this.handleChange}/>
            </Col>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleSubmit}>
            Entrar
          </Button>
        </Form>
      </Row>
   );
  }
}

export default Login