import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

import RubroAPI from '../rubro/rubroAPI';

class Rubro extends React.Component {
  constructor(props) {
    super(props);
    this.endpoint = "http://localhost:8080/rubro";
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      dto: null,
      alert: null,
      showModal: false,
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
    this.setState({ "editable" : this.props.match.params.edit === "edit" });
  }

  handleChange(event) {
    const dto = this.state.dto;
    dto.nombre = event.target.value;
    this.setState({dto: dto});
  }

  async handleUpdate() {
    const { dto } = this.state;
    
    var response = await RubroAPI.update(dto);

    if (! response.error) {
      this.setState({alert: (
        <Alert key="0" variant="success">
          El rubro se guardo correctamente.
        </Alert>
      )})
    } else {
      this.setState({alert: (
        <Alert key="0" variant="danger">
          El rubro no pudo ser guardado.
        </Alert>
      )})
    }

  }

  async handleDelete() {
    const { idToDelete } = this.state;
    
    var response = await RubroAPI.delete(idToDelete);


    if (! response.error) {
      this.setState({
        alert: (
        <Alert key="0" variant="success">
          El rubro se elimino correctamente.
        </Alert>),
        idToDelete: null,
        showModal: false
      })
    } else {
      this.setState({
        alert: (
        <Alert key="0" variant="danger">
          El rubro no pudo ser eliminado.
        </Alert>),
        idToDelete: null,
        showModal: false
      })
    }
  }
  
  handleShowModal(event) {
    this.setState({
      showModal: true,
      idToDelete: (event.target.id).split(".")[2]
    })
  }  
  
  handleHideModal() {
    this.setState({
      showModal: false,
      idToDelete: null
    })
  }  

  renderList() {
    const { dto, alert, showModal } = this.state;
    return (
      <>
        <Modal show={showModal} onHide={this.handleHideModal} >
          <Modal.Footer>
            <Modal.Title>Esta seguro de que desea eliminar este rubro?</Modal.Title>
            <Button variant="secondary" onClick={this.handleHideModal} >
              Cancelar
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
        {alert}
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
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/rubro/" + rubro.id} >Ver</Button>
                  <Button 
                    variant="primary" href={"/rubro/" + rubro.id + "/edit"} >Editar</Button>
                  <Button 
                    id={"delete.rubro." + rubro.id} variant="danger" onClick={this.handleShowModal} >Eliminar</Button>
                  </ButtonGroup>
                </td>
                </tr>
            )}
        </tbody>
        </Table>
      </>
    );
  }

  renderSingle() {
    const { dto, editable, alert } = this.state;
    return (
      <Form>
        {alert}
        <Form.Group as={Row} controlId="rubro">
          <Form.Label column sm="2">
            Id
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="rubro">
          <Form.Label column sm="2">
            Nombre
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly={!editable} defaultValue={dto.nombre} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="rubro">
          <Col sm="6">
            <Button variant="primary" href="/rubro/">
              Volver
            </Button>
          </Col>
          <Col sm="6">
            <Button variant="success" onClick={this.handleUpdate}>
              Guardar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    );
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
          return this.renderList();
        case 'single':
          return this.renderSingle()
        default:
          return this.renderList();
      }
    }
  }
}

export default Rubro 