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
        <div class="categories-menu mrg-xs">
            <div class="category-heading">
                <h3> Menu</h3>
            </div>
            <div class="category-menu-list ">
              <ul>
                <li><a href="/rubro/">Rubros</a></li>
                <li><a href="/usuario/">Usuarios</a></li>
                <li><a href="/articulo/">Artículos</a></li>
              </ul>
            </div>
          </div>
      );
    } else {
      return null
    }
  }
}

export default Menu