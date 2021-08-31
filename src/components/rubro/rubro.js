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
import RubroAPI from '../rubro/rubroAPI';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';

class Rubro extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = RubroAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      filterText: ""
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
    dto.nombre = event.target.value;

    if (id === "filterText"){
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
          El rubro se guardo correctamente.
        </Alert>
        ),
        dto: response.result
      })
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
    
    var response = await this.api.delete(idToDelete);


    if (! response.error) {
      this.setState({
        alert: (
        <Alert key="0" variant="success">
          El rubro se elimino correctamente.
        </Alert>),
        idToDelete: null,
        showModal: false
      });
      this.findAll()
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
    const { dto, alert, showModal, filterText } = this.state;
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
        <h1>Rubros<Button title="Nuevo Rubro" variant="primary" href={"/rubro/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <InputGroup className="mb-3">
          <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
            <Dropdown.Item >Nombre</Dropdown.Item>
          </DropdownButton>
          <InputGroup.Text>Nombre</InputGroup.Text>
          <Form.Control type="text" id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
        </InputGroup>
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {dto.filter(rubro =>rubro.nombre.toLowerCase().includes(filterText.toLowerCase()))
                .map((rubro) =>
                <tr>
                <td>{rubro.id}</td>
                <td>{rubro.nombre}</td>
                <td>
                <ButtonGroup>
                  <Button title="Ver"
                    variant="primary" href={"/rubro/view/" + rubro.id} ><ZoomIn size={20}/></Button>
                  <Button title="Editar"
                    variant="primary" href={"/rubro/edit/" + rubro.id} ><Pencil size={20}/></Button>
                  <Button title="Eliminar"
                    id={"delete.rubro." + rubro.id} variant="danger" onClick={this.handleShowModal} ><Trash size={20}/></Button>
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
            <Button variant="success" onClick={this.handleUpsert}>
              Guardar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    );
  }

  render() {
    const { error, isLoaded, currentView, dto} = this.state;
    if (error) {
      return <div>Error: {dto.error}</div>;
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