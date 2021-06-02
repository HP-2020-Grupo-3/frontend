import React from 'react';
import GenericComponent from "../common/genericComponent";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Plus } from 'react-bootstrap-icons';

import UsuarioAPI from '../usuario/usuarioAPI';

class Usuario extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = UsuarioAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {

    if (!this.props.match.params.mode) {
      this.findAll();
    } else if (this.props.match.params.mode === "view" | this.props.match.params.mode === "edit") {
      // TODO: Validar que exista el id if (!this.props.match.params.id) then mostrar algun error
      this.findById(this.props.match.params.id);
      this.setState({ "editable" : this.props.match.params.mode === "edit" });
    } else if (this.props.match.params.mode === "new") {
      this.getBaseDto();
      this.setState({ "editable" : true });
    }
  }

  handleChange(event) {
    const dto = this.state.dto;
    const id = event.target.id;
   

    
    if (id === "usuario.username"){
      dto.username = event.target.value;      
    } else if (id === "usuario.password"){      
      dto.password = event.target.value;
    } else if (id === "usuario.nombre"){
      dto.nombre = event.target.value;
    } else if (id=== "usuario.apellido"){
      dto.apellido = event.target.value;
    } else if (id === "usuario.email"){
      dto.email = event.target.value;
    } else if (id === "usuario.role"){
      dto.currentRole = JSON.parse(event.target.value)
    } 
          
    this.setState({dto: dto});

  }

  async handleUpsert() {
    const { dto } = this.state;
    
    var response;
    if (dto.id) {
      response = await this.api.update(dto);
    } else {
      response = await this.api.save(dto);
    }

    if (! response.error) {
      this.setState({
        alert: (
        <Alert key="0" variant="success">
          El usuario se guardo correctamente.
        </Alert>
        ),
        dto: response.result
      })
    } else {
      this.setState({alert: (
        <Alert key="0" variant="danger">
          El usuario no pudo ser guardado.
        </Alert>
      )})
    }

  }

  async handleDelete() {
    // error con FK domicilio

    const { idToDelete } = this.state;
    
    var response = await this.api.delete(idToDelete);
    
    if (! response.error) {
      this.setState({
        alert: (
        <Alert key="0" variant="success">
          El usuario se eliminó correctamente.
        </Alert>),
        idToDelete: null,
        showModal: false
      });
      this.findAll()
    } else {
      this.setState({
        alert: (
        <Alert key="0" variant="danger">
          El usuario no pudo ser eliminado.
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
            <Modal.Title>Esta seguro de que desea eliminar este usuario?</Modal.Title>
            <Button variant="secondary" onClick={this.handleHideModal} >
              Cancelar
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
        <h1>Usuarios<Button variant="primary" href={"/usuario/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre de usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>E-Mail</th>
            <th>Rol</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {dto.map((usuario) =>
                <tr>
                <td>{usuario.id}</td>
                <td>{usuario.username}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role.name}</td>
                <td>
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/usuario/view/" + usuario.id} >Ver</Button>
                  <Button 
                    variant="primary" href={"/usuario/edit/" + usuario.id} >Editar</Button>
                  <Button 
                    id={"delete.usuario." + usuario.id} variant="danger" onClick={this.handleShowModal} >Eliminar</Button>
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
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Id
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Nombre de usuario
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="usuario.username"  readOnly={!editable} defaultValue={dto.username} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control type="password" id="usuario.password" readOnly={!editable} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Nombre
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="usuario.nombre" readOnly={!editable} defaultValue={dto.nombre} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Apellido
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="usuario.apellido" readOnly={!editable} defaultValue={dto.apellido} onChange={this.handleChange}/>
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            E-Mail
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="usuario.email" readOnly={!editable} defaultValue={dto.email} onChange={this.handleChange}/>
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Form.Label column sm="2">
            Rol
          </Form.Label>
          <Col sm="10">
            {this.renderComboBox("usuario.role", dto.currentRole, dto.availableRoles, editable, "name")}
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="usuario">
          <Col sm="6">
            <Button variant="primary" onClick={this.props.history.goBack}>
              Volver
            </Button>
          </Col>
          <Col sm="6">
            <Button variant="success" hidden={!editable} onClick={this.handleUpsert}>
              Guardar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    );
  }

  render() {
    const { error, isLoaded, currentView} = this.state;
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

export default Usuario
