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
import InputGroup from 'react-bootstrap/InputGroup';
import { Plus, Trash, Pencil, ZoomIn } from 'react-bootstrap-icons';
import RubroAPI from '../rubro/rubroAPI';
import ArticuloAPI from '../articulo/articuloAPI';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';

class Articulo extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = ArticuloAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    var filterFunction = function(articulo, filterText) {return articulo.nombre.toLowerCase().includes(filterText.toLowerCase())}
    this.state = {
      filterText: "",
      filterBy: "nombre",
      filterLabel: "Nombre",
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

  createSelectItems() {
    let items = [];
    
    let rubros=RubroAPI.findAll();
    console.log(rubros.length);
    items.push(<option key={1} value={1}>{"GENERICO"}</option>);
    items.push(<option key={2} value={2}>{"GENERICO 2"}</option>);

    return items;
  }  

  handleChange(event) {
    const dto = this.state.dto;
    const id = event.target.id;
    var filterText = this.state.filterText;
    if (id === "articulo.nombre"){
      dto.nombre=event.target.value;      
    } else if (id === "articulo.descripcion"){      
      dto.descripcion = event.target.value;
    } else if (id === "articulo.precio"){      
      dto.precio = event.target.value;
    } else if (id === "articulo.imagen"){
      dto.imagen = event.target.value;
    } else if (id === "articulo.stockActual"){
      dto.stockActual = event.target.value;
    } else if (id === "articulo.stockDeseado"){
      dto.stockDeseado = event.target.value;
    } else if (id === "articulo.rubro"){
      dto.currentRubro = JSON.parse(event.target.value);
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
          El artículo se guardo correctamente.
        </Alert>
        ),
        dto: response.result
      })
    } else {
      this.setState({alert: (
        <Alert key="0" variant="danger">
          El artículo no pudo ser guardado.
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
          El artículo se eliminó correctamente.
        </Alert>),
        idToDelete: null,
        showModal: false
      });
      this.findAll()
    } else {
      this.setState({
        alert: (
        <Alert key="0" variant="danger">
          El artículo no pudo ser eliminado.
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

  handleFilter(param) {
    var filterLabel, filterFunction;


    if (param === "nombre"){
      filterLabel = "Nombre";
      filterFunction = function(articulo, filterText) {return articulo.nombre.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "descripcion"){
      filterLabel = "Descripción";
      filterFunction = function(articulo, filterText) {return articulo.descripcion.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "currentRubro.nombre"){
      filterLabel = "Rubro";
      filterFunction = function(articulo, filterText) {return articulo.currentRubro.nombre.toLowerCase().includes(filterText.toLowerCase())}
    }
    this.setState({ filterBy: param, filterLabel: filterLabel, filterFunction: filterFunction});
  }

  renderList() {
    const { dto, alert, showModal, filterText, filterBy, filterLabel, filterFunction } = this.state;
    return (
      <>
        <Modal show={showModal} onHide={this.handleHideModal} >
          <Modal.Footer>
            <Modal.Title>Esta seguro de que desea eliminar este Articulo?</Modal.Title>
            <Button variant="secondary" onClick={this.handleHideModal} >
              Cancelar
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
        <h1>Artículos<Button title="Nuevo Articulo" variant="primary" href={"/articulo/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <InputGroup className="mb-3">
         <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
            <Dropdown.Item onClick={() => this.handleFilter("nombre")}>Nombre</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("descripcion")}>Descripción</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("currentRubro.nombre")}>Rubro</Dropdown.Item>
          </DropdownButton>
          <InputGroup.Text>{filterLabel}</InputGroup.Text>
          <Form.Control type="text" id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
        </InputGroup>
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>St. Act.</th>
            <th>St. Des.</th>
            <th>Rubro</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {dto.filter(articulo =>filterFunction(articulo, filterText))
                .map((articulo) =>
                <tr>
                <td>{articulo.id}</td>
                <td>{articulo.nombre}</td>
                <td>{articulo.descripcion}</td>
                <td>$ {articulo.precio.toFixed(2)}</td>
                <td>{articulo.stockActual}</td>
                <td>{articulo.stockDeseado}</td>
                <td>{articulo.currentRubro.nombre}</td>
                <td>
                  <ButtonGroup>
                    <Button 
                      variant="primary" href={"/articulo/view/" + articulo.id} ><ZoomIn size={20}/></Button>
                    <Button 
                      variant="primary" href={"/articulo/edit/" + articulo.id} ><Pencil size={20}/></Button>
                    <Button 
                      id={"delete.articulo." + articulo.id} variant="danger" onClick={this.handleShowModal} ><Trash size={20}/></Button>
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
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Id
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Nombre
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="articulo.nombre"  readOnly={!editable} defaultValue={dto.nombre} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Descripción
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="articulo.descripcion" readOnly={!editable} defaultValue={dto.descripcion} onChange={this.handleChange}/>
          </Col>
          </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Precio
          </Form.Label>
          <Col sm="10">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
              <Form.Control type="number" step={0.1} id="articulo.precio" readOnly={!editable} value={dto.precio} onChange={this.handleChange}/>
          </InputGroup>
          </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Imagen
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="articulo.imagen" readOnly={!editable} defaultValue={dto.imagen} onChange={this.handleChange}/>
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Stock Actual
          </Form.Label>
          <Col sm="10">
            <Form.Control type="number" id="articulo.stockActual" readOnly={!editable} defaultValue={dto.stockActual} onChange={this.handleChange}/>
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Stock Deseado
          </Form.Label>
          <Col sm="10">
            <Form.Control type="number" id="articulo.stockDeseado" readOnly={!editable} defaultValue={dto.stockDeseado} onChange={this.handleChange}/>
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Form.Label column sm="2">
            Rubro
          </Form.Label>
          <Col sm="10">
            {this.renderComboBox("articulo.rubro", dto.currentRubro, dto.availableRubros, editable)}
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Col sm="6">
            <Button variant="primary" href="/articulo/">
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
    const { error, isLoaded, currentView, dto} = this.state;
    if (error) {
      console.log(dto);
      return <div>Error: {dto.message}</div>;
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

export default Articulo
