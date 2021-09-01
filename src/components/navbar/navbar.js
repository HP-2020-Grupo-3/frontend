import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SecurityContext from '../security/securityContext'

class Navegacion extends React.Component {
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
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
      <header id="header" class="htc-header header--3 bg__white">
      <div id="sticky-header-with-topbar" class="mainmenu__area sticky__header">
        <div class="justify-content-md-center row">
        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"></div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <div class="logo">
            <a href="/">
              <h2>Veni de Mary</h2>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"></div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">  
          <ul class="menu-extra main__menu">
          { SecurityContext.getPrincipal() 
          ? <li class="drop"><a href="#"><span class="ti-user"></span> {SecurityContext.getPrincipal().username}</a>
                <ul class="dropdown">
                  <li><a href="/login" onClick={SecurityContext.logout}>Cerrar Sesion</a></li>
                </ul>
            </li>
          : <li class="drop"><a href="/login"><span class="ti-key"></span> Iniciar Sesion</a></li>
          }
          </ul>
        </div>
        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"></div>
      </div>
    </div>
  </header>
      );
    }
  }
}

export default Navegacion