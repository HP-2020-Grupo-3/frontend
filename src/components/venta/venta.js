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
import { Plus, Dot } from 'react-bootstrap-icons';
import SecurityContext from '../security/securityContext'
import VentaAPI from '../venta/ventaAPI';

class Venta extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = VentaAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleAddLineaVenta = this.handleAddLineaVenta.bind(this);
    this.handlerRemoveLineaVenta = this.handlerRemoveLineaVenta.bind(this);
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

    if (id === "venta.numeroComprobante"){
      dto.numeroComprobante = event.target.value;      
    } else if (id === "venta.isEntregada"){      
      dto.isEntregada = event.target.value;
    } else if (id === "venta.nota"){
      dto.nota = event.target.value;
    } else if (id === "venta.currentDescuento"){
      dto.currentDescuento = JSON.parse(event.target.value);
    } else if (id === "venta.currentMedioPago"){
      dto.currentMedioPago = JSON.parse(event.target.value);
    } else if (id === "venta.currentTipoEntrega"){
      dto.currentTipoEntrega = JSON.parse(event.target.value);
    } else if (id === "venta.lineaVenta.articulo"){
      dto.selectedArticulo = JSON.parse(event.target.value);
    } else if (id === "venta.lineaVenta.cantidad"){
      dto.selectedCantidad = parseInt(event.target.value);
    } 
    
    console.log(dto)
    this.setState({dto: dto});

  }

  async handleUpsert() {
    const { dto } = this.state;
    dto.usuarioId = SecurityContext.getPrincipal().id;
    
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

  handleAddLineaVenta() {
    const { dto } = this.state;
    const index = dto.availableArticuloDto.indexOf(dto.selectedArticulo);

    if (!dto.addedArticuloDto) {
      dto.addedArticuloDto = []
    }

    dto.lineaVentaDtos.push({
      cantidad: dto.selectedCantidad,
      precio: dto.selectedArticulo.precio,
      articuloNombre: dto.selectedArticulo.nombre,
      articuloId: dto.selectedArticulo.id
    })
    dto.addedArticuloDto.push(dto.selectedArticulo);
    dto.availableArticuloDto = dto.availableArticuloDto.filter((articulo) => articulo.id != dto.selectedArticulo.id);
    dto.selectedArticulo = null;
    dto.selectedCantidad = null;

    this.setState({
      dto: dto
    })
  }  
  
  handlerRemoveLineaVenta(event) {
    const { dto } = this.state;
    const articuloId = (event.target.id).split(".")[2]
    
    const removedLinea = dto.lineaVentaDtos.find((linea) => linea.articuloId == articuloId)
    dto.lineaVentaDtos = dto.lineaVentaDtos.filter((linea) => linea.articuloId != articuloId)
    
    dto.availableArticuloDto.push(dto.addedArticuloDto.find((articulo) => articulo.id == removedLinea.articuloId));
    dto.addedArticuloDto = dto.addedArticuloDto.filter((articulo) => articulo.id != removedLinea.articuloId);
    dto.selectedArticulo = null;
    dto.selectedCantidad = null;


    this.setState({
      dto: dto
    })
  }  

  renderList() {
    const { dto, alert, showModal } = this.state;
    return (
      <>
        <Modal show={showModal} onHide={this.handleHideModal} >
          <Modal.Footer>
            <Modal.Title>Esta seguro de que desea eliminar este Venta?</Modal.Title>
            <Button variant="secondary" onClick={this.handleHideModal} >
              Cancelar
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
        <h1>Venta<Button variant="primary" href={"/venta/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            {dto.map((venta) =>
                <tr>
                <td>{venta.id}</td>
                <td>{venta.fecha}</td>
                <td>
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/venta/view/" + venta.id} >Ver</Button>
                  <Button 
                    variant="primary" href={"/venta/edit/" + venta.id} >Editar</Button>
                  <Button 
                    id={"delete.venta." + venta.id} variant="danger" onClick={this.handleShowModal} >Eliminar</Button>
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
    if (!dto.selectedCantidad) {
      dto.selectedCantidad = 1
      this.setState({dto: dto})
    }

    const subtotal = dto.lineaVentaDtos.reduce((acc, linea) => acc += linea.precio * linea.cantidad, 0 );
    
    return (
      <Form>
        {alert}
        <Form.Group as={Row} controlId="venta">
          <Form.Label column sm="2">
            Id
          </Form.Label>
          <Col sm="3">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
          <Form.Label column sm="2">
            Fecha
          </Form.Label>
          <Col sm="5">
            <Form.Control type="date" id="venta.fecha" readOnly value={dto.fecha}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="venta">
          <Form.Label column sm="3">
            Nro Comprobante
          </Form.Label>
          <Col sm="6">
            <Form.Control type="number" id="venta.numeroComprobante" readOnly defaultValue={dto.numeroComprobante} onChange={this.handleChange}/>
          </Col>
          <Form.Label column sm="3">
            <Form.Check type="checkbox" id="venta.isEntregada" label="Entregada" readOnly={!editable} value={dto.isEntregada} onChange={this.handleChange}/>
          </Form.Label>
        </Form.Group>
        <Form.Group as={Row} controlId="venta">
        <Form.Label column sm="3">
            Notas
          </Form.Label>
          <Col sm="9">
            <Form.Control type="textarea" id="venta.nota" rows={3} readOnly={!editable} defaultValue={dto.nota} onChange={this.handleChange}/>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="venta">
          <Form.Label column sm="2">
            Medio de Pago
          </Form.Label>
          <Col sm="4">
            {this.renderComboBox("venta.currentMedioPago", dto.currentMedioPago, dto.availableMedioPago, editable)}
          </Col> 
          <Form.Label column sm="2">
            Entrega
          </Form.Label>
          <Col sm="4">
            {this.renderComboBox("venta.currentTipoEntrega", dto.currentTipoEntrega, dto.availableTipoEntrega, editable)}
          </Col> 
        </Form.Group>
        <Form.Group as={Row} controlId="venta">

        </Form.Group> <hr />

        <Form.Group as={Row} controlId="venta">
          <Form.Label column center sm="12">
            Articulos
          </Form.Label>
        </Form.Group>

        <Form.Group as={Row} controlId="venta" hidden={!editable}>
          <Form.Label column sm="1">
            Articulo
          </Form.Label>
          <Col sm="3">
            {this.renderComboBox("venta.lineaVenta.articulo", dto.availableArticuloDto, dto.availableArticuloDto, editable)}
          </Col> 
          <Col sm="2">
            <Form.Control plaintext readOnly 
              defaultValue={ dto.selectedArticulo ? this.formatCurrency(dto.selectedArticulo.precio) : "" } onChange={this.handleChange}/>
          </Col>
          <Form.Label column sm="1">
            x
          </Form.Label>
          <Col sm="2">
            <Form.Control type="number" id="venta.lineaVenta.cantidad" readOnly={!editable} defaultValue={1} onChange={this.handleChange}/>
          </Col>
          <Col sm="2">
            <Form.Control plaintext readOnly 
              defaultValue={ dto.selectedArticulo ? this.formatCurrency(dto.selectedArticulo.precio * dto.selectedCantidad) : "" } onChange={this.handleChange}/>
          </Col>
          <Col sm="1">
            <Button variant="success" hidden={!editable || !dto.selectedArticulo} onClick={this.handleAddLineaVenta}>
                +
            </Button>
          </Col>

        </Form.Group>

        <Table striped bordered hover size="sm">
        <thead>
            <tr>
            <th>Articulo</th>
            <th>P. Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
            </tr>
        </thead>
        <tbody align-middle >
            {dto.lineaVentaDtos.map((linea) =>
                <tr>
                <td>{linea.articuloNombre}</td>
                <td>{this.formatCurrency(linea.precio)}</td>
                <td>{(linea.cantidad)}</td>
                <td>{this.formatCurrency(linea.precio * linea.cantidad)}</td>
                <td>
                 <Button 
                    id={"delete.linea." + linea.articuloId} variant="link" size="sm" onClick={this.handlerRemoveLineaVenta} >Quitar</Button>
                </td>
                </tr>
            )}
        </tbody>
        </Table>

        <Form.Group as={Row} controlId="venta">
          <Form.Label column center sm="8"></Form.Label>
          <Form.Label column center sm="2">
            Subtotal
          </Form.Label>
          <Col sm="2">
            <Form.Control plaintext readOnly 
              value={this.formatCurrency(subtotal)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="venta">
          <Form.Label column center sm="8"></Form.Label>
          <Form.Label column center sm="2">
            Descuento
          </Form.Label>
          <Col sm="2">
            {this.renderComboBox("venta.currentDescuento", dto.currentDescuento, dto.availableDescuento, editable, "displayText")}
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="venta">
          <Form.Label column center sm="8"></Form.Label>
          <Form.Label column center sm="2">
            Total
          </Form.Label>
          <Col sm="2">
            <Form.Control plaintext readOnly 
              value={this.formatCurrency(subtotal - subtotal * dto.currentDescuento.valor)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="venta">
          <Col sm="6">
            <Button variant="primary" href="/venta/">
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

export default Venta