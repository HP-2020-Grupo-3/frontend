import React from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import SecurityContext from '../security/securityContext'


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      dto: null
    };
  }

  render() {
    const { error, isLoaded, dto } = this.state;
    // FIXME: comprobacion del rol super trucha, hay que mejorar esto
    if (SecurityContext.getPrincipal() && SecurityContext.getPrincipal().role != "ROLE_USER") {
      return (
        <Col xs lg="3"> {/* MENU */}
          <ListGroup variant="flush">
            <ListGroup.Item><a href="/rubro/">Rubros</a></ListGroup.Item>
            <ListGroup.Item><a href="/usuario/">Usuarios</a></ListGroup.Item>
          </ListGroup>
        </Col>
      );
    } else {
      return null
    }
  }
}

export default Menu