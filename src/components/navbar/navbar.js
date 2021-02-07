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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Veni de Mary</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
              { SecurityContext.getPrincipal() 
                ? <NavDropdown title={SecurityContext.getPrincipal().username} id="collasible-nav-dropdown">
                  {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/login" onClick={SecurityContext.logout}>Cerrar Sesion</NavDropdown.Item>
                </NavDropdown>
                : <Nav.Link eventKey={2} href="/login">Iniciar Sesion</Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }
}

export default Navegacion