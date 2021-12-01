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
import { Plus, Trash, Pencil, ZoomIn} from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';
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
    this.handleFilter = this.handleFilter.bind(this);
    var filterFunction = function(usuario, filterText) {return usuario.username.toLowerCase().includes(filterText.toLowerCase())}
    this.state = {
      filterText: "",
      filterBy: "username",
      filterLabel: "Nombre de usuario",
      filterFunction: filterFunction
    };
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
    var filterText = this.state.filterText;

    
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
    } else if (id === "filterText"){
      filterText = event.target.value;
    } 
          
    this.setState({dto: dto, filterText: filterText});

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
  
  handleShowModal(id) {
    this.setState({
      showModal: true,
      idToDelete: id
    })
  }  
  
  handleHideModal() {
    this.setState({
      showModal: false,
      idToDelete: null
    })
  }  

  handleFilter(param) {
    var filterLabel, filterFunction;
    const filterBy = this.state.filterBy

    if (param === "username"){
      filterLabel = "Nombre de usuario";
      filterFunction = function(usuario, filterText) {return usuario.username.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "nombre"){
      filterLabel = "Nombre";
      filterFunction = function(usuario, filterText) {return usuario.nombre.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "role"){
      filterLabel = "Rol";
      filterFunction = function(usuario, filterText) {return usuario.role.name.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "apellido"){
      filterLabel = "Apellido";
      filterFunction = function(usuario, filterText) {return usuario.apellido.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "email"){
      filterLabel = "E-Mail";
      filterFunction = function(usuario, filterText) {return usuario.email.toLowerCase().includes(filterText.toLowerCase())}
    }
    this.setState({ filterBy: param, filterLabel: filterLabel, filterFunction: filterFunction});
  }

  renderList() {
    const { dto, alert, showModal, filterText, filterBy, filterLabel, filterFunction } = this.state;
    console.log("filterText: ", filterText);
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
        <h1>Usuarios<Button title="Nuevo Usuario" variant="primary" href={"/usuario/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <InputGroup className="mb-3">
         <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
            <Dropdown.Item onClick={() => this.handleFilter("username")}>Nombre de usuario</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("nombre")}>Nombre</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("apellido")}>Apellido</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("email")}>E-Mail</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("role")}>Rol</Dropdown.Item>
          </DropdownButton>
          <InputGroup.Text>{filterLabel}</InputGroup.Text>
          <Form.Control type="text" id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
        </InputGroup>
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
            {dto.filter(usuario =>filterFunction(usuario, filterText))
                .map((usuario) =>
                <tr>
                <td>{usuario.id}</td>
                <td>{usuario.username}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role.name}</td>
                <td>
                <ButtonGroup>
                  <Button title="Ver"
                    variant="primary" href={"/usuario/view/" + usuario.id} ><ZoomIn size={20}/></Button>
                  <Button title="Editar"
                    variant="primary" href={"/usuario/edit/" + usuario.id} ><Pencil size={20}/></Button>
                  <Button title="Eliminar"
                    id={"delete.usuario." + usuario.id} variant="danger" onClick={this.handleShowModal.bind(this, usuario.id)} ><Trash size={20}/></Button>
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
