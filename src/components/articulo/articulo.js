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
import RubroAPI from '../rubro/rubroAPI';
import ArticuloAPI from '../articulo/articuloAPI';

class Articulo extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = ArticuloAPI;
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

  createSelectItems() {
    // SEGUIR ACA!!!
    let items = [];
    
    let rubros=RubroAPI.findAll();
    console.log(rubros.length);
    items.push(<option key={1} value={1}>{"GENERICO"}</option>);
    items.push(<option key={2} value={2}>{"GENERICO 2"}</option>);
    //items.push(<option key={1} value={1}>{rubros[1].nombre}</option>);
/*
    for (let i = 0; i <= rubros.length; i++) {             
         items.push(<option key={i} value={i}>{rubros[i].nombre}</option>); 
         console.log(rubros[i].nombre);  
         //here I will be creating my options dynamically based on
         //what props are currently passed to the parent component
    }
  */
    return items;
  }  

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }

  handleChange(event) {
    const dto = this.state.dto;
    const id = event.target.id;
   

    
    if (id === "articulo.nombre"){
      dto.nombre=event.target.value;      
    } else if (id === "articulo.descripcion"){      
      dto.descripcion = event.target.value;
    } else if (id === "articulo.imagen"){
      dto.imagen = event.target.value;
    } else if (id === "articulo.stockActual"){
      dto.stockActual = event.target.value;
    } else if (id === "articulo.stockDeseado"){
      dto.stockDeseado = event.target.value;
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

  renderList() {
    const { dto, alert, showModal } = this.state;
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
        <h1>Artículos<Button variant="primary" href={"/articulo/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Stock Actual</th>
            <th>Stock Deseado</th>
            <th>Rubro</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {dto.map((articulo) =>
                <tr>
                <td>{articulo.id}</td>
                <td>{articulo.nombre}</td>
                <td>{articulo.descripcion}</td>
                <td>{articulo.imagen}</td>
                <td>{articulo.stockActual}</td>
                <td>{articulo.stockDeseado}</td>
                <td>{articulo.rubro.nombre}</td>
                <td>
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/articulo/view/" + articulo.id} >Ver</Button>
                  <Button 
                    variant="primary" href={"/articulo/edit/" + articulo.id} >Editar</Button>
                  <Button 
                    id={"delete.articulo." + articulo.id} variant="danger" onClick={this.handleShowModal} >Eliminar</Button>
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
            <Form.Control as="Select" type="text" id="articulo.rubro" readOnly={!editable} defaultValue={"GENERICO"} onChange={this.handleChange}/>
            
            
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="articulo">
          <Col sm="6">
            <Button variant="primary" href="/articulo/">
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

export default Articulo