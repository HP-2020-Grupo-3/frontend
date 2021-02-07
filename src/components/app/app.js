import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './app.css';
import Navegacion from '../navbar/navbar'
import Menu from '../navbar/menu'
import Rubro from '../rubro/rubro'
import Shop from '../shop/shop'
import Login from '../security/login';


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
            <Menu />
            <Col xs lg="9">
              <Switch>
                <Route
                  path="/rubro/:mode?/:id?"
                  component={Rubro} />
                <Route
                  path="/login"
                  component={Login} />
                <Route
                  path="/shop"
                  component={Shop} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </BrowserRouter>
  );
}
