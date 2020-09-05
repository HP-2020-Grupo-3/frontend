import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import RubroAPI from '../rubro/rubroAPI';

class Rubro extends React.Component {
  constructor(props) {
    super(props);
    this.endpoint = "http://localhost:8080/rubro";
    this.state = {
      error: null,
      isLoaded: false,
      dto: null
    };
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const response = await RubroAPI.findById(this.props.match.params.id);
      if (!response.error) {
        this.setState({ error: false, isLoaded: true, currentView: 'single', dto: response.result});
      } else {
        this.setState({ error: true, isLoaded: true, currentView: 'single', dto: response.result });
      } 
    } else {
      const response = await RubroAPI.findAll();
      if (!response.error) {
        this.setState({ error: false, isLoaded: true, currentView: 'list', dto: response.result});
      } else {
        this.setState({ error: true, isLoaded: true, currentView: 'list', dto: response.result });
      } 
    }
  }

  renderList(dto) {
    return (
      <Table striped bordered hover>
      <thead>
          <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Acciones</th>
          </tr>
      </thead>
      <tbody>
          {dto.map((rubro) =>
              <tr>
              <td>{rubro.id}</td>
              <td>{rubro.nombre}</td>
              <td>
                <Button variant="primary" href={"/rubro/" + rubro.id}>Editar</Button>
              </td>
              </tr>
          )}
      </tbody>
      </Table>
    );
  }

  switchToUpdate() {
    this.setState({currentView: 'update'});
  }

  render() {
    const { error, isLoaded, dto, currentView} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      switch (currentView) {
        case 'list':
          return this.renderList(dto);
        case 'single':
          return (
            <div>
              <p>{dto.id}</p>
              <p>{dto.nombre}</p>
            </div>
          )
        default:
          return this.renderList(dto);
      }
    }
  }
}

export default Rubro 