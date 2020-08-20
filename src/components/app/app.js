import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './app.css';
import Navegacion from '../navbar/navbar'

export function App() {
  return (
    <div className="App">
      <Container>
        <Navegacion />
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <h1>Veni de Mary</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs lg="3">
            menu
          </Col>
          <Col xs lg="9">
            pantalla de cada menu
          </Col>
        </Row>
      </Container>
    </div>
  );
}
