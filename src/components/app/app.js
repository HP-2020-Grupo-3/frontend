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

import Usuario from '../usuario/usuario'
import Articulo from '../articulo/articulo'

export function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Container>
          <Navegacion />
          <section class="categories-slider-area bg__white">
        <div class="container">
          <div class="row">
            <div class="col-md-3 col-lg-3 col-sm-4 col-xs-12 float-rigth-style">
              <Menu />
            </div>
            <div class="col-md-9 col-lg-9 col-sm-8 col-xs-12 float-left-style">
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
                  <Route
                    path="/usuario/:mode?/:id?"
                    component={Usuario} />
                  <Route
                    path="/articulo/:mode?/:id?"
                    component={Articulo} />
                </Switch>
            </div>
          </div>
        </div>
      </section>
      </Container>
      </div>
    </BrowserRouter>
  );
}
