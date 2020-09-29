import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './app.css';
import Navegacion from '../navbar/navbar'
import Rubro from '../rubro/rubro'

export function App() {
  return (
    <BrowserRouter>
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
            <ListGroup variant="flush">
              <ListGroup.Item><a href="/rubro/">Rubros</a></ListGroup.Item>
            </ListGroup>
            </Col>
            <Col xs lg="9">
              <Switch>
                <Route
                  path="/rubro/:mode?/:id?"
                  component={Rubro} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </BrowserRouter>
  );
}
