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
import { Cpu, Plus } from 'react-bootstrap-icons';
import ComprobantePagoAPI from '../comprobantePago/comprobantePagoAPI';
import VentaAPI from '../venta/ventaAPI';
import PortalWindow from '../ui/portalWindow';
import ComprobantePagoImprimible from '../ui/comprobantePagoImprimible';
import InputGroup from 'react-bootstrap/InputGroup';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';

class ComprobantePago extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = ComprobantePagoAPI;
    this.ventaApi = VentaAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
    this.closeWindowPortal = this.closeWindowPortal.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    var filterFunction = function(comprobantePago, filterText) {return comprobantePago.numeroComprobante.toString().toLowerCase().includes(filterText.toLowerCase())}

    this.state = {
      showWindowPortal: false,
      inputType: "text",
      filterText: "",
      filterBy: "numeroComprobante",
      filterLabel: "N° Comprobante",
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

    if (id === "cp.numeroFactura") {
      dto.numeroFactura = event.target.value;
    } else if (id === "cp.nota"){
      dto.nota = event.target.value;
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
          El comprobante de pago se guardó correctamente.
        </Alert>
        ),
        dto: response.result
      })
    } else {
      this.setState({alert: (
        <Alert key="0" variant="danger">
          El comprobante de pago no pudo ser guardado.
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

  async toggleWindowPortal(comprobantePago) {
    this.setState(state => ({
      ...state,
      showWindowPortal: true,
      comprobantePago: comprobantePago,
    }));
  }
  
  closeWindowPortal() {
    this.setState({ showWindowPortal: false })
  }

  handleFilter(param) {
    var filterLabel, filterFunction;
    var inputType = this.state.inputType;

    if (param === "numeroComprobante"){
      filterLabel = "N° Comprobante";
      inputType = "text";
      filterFunction = function(comprobantePago, filterText) {return comprobantePago.numeroComprobante.toString().toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "numeroFactura"){
      filterLabel = "N° Factura";
      inputType = "text";
      filterFunction = function(comprobantePago, filterText) {return comprobantePago.numeroFactura.toLowerCase().includes(filterText.toLowerCase())}
    } else if (param === "fecha"){
      filterLabel = "Fecha";
      inputType = "date";
      filterFunction = function(comprobantePago, filterText) {return comprobantePago.fecha.includes(filterText)}
    } 
    this.setState({ filterBy: param, filterLabel: filterLabel, inputType: inputType, filterFunction: filterFunction});
  }

  renderList() {
    const { dto, alert, showModal, filterText, inputType, filterLabel, filterFunction } = this.state;
  
    return (
      <>
        {this.state.showWindowPortal && (
          <PortalWindow closeWindowPortal={this.closeWindowPortal} >
            <ComprobantePagoImprimible closeWindowPortal={this.closeWindowPortal} comprobantePago={this.state.comprobantePago}/>
          </PortalWindow>
        )}
        <h1>Comprobantes de Pagos</h1>
        {alert}
        <InputGroup className="mb-3">
         <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
            <Dropdown.Item onClick={() => this.handleFilter("numeroComprobante")}>N° Comprobante</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("fecha")}>Fecha</Dropdown.Item>
            <Dropdown.Item onClick={() => this.handleFilter("numeroFactura")}>N° Factura</Dropdown.Item>
          </DropdownButton>
          <InputGroup.Text>{filterLabel}</InputGroup.Text>
          <Form.Control type={inputType} id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
        </InputGroup>
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>N° Comprobante</th>
            <th>Fecha</th>
            <th>N° Factura</th>
            <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            {dto.sort((a, b) => b.id - a.id)
                .filter(comprobantePago => filterFunction(comprobantePago, filterText))
                .map((comprobantePago) =>
                <tr>
                <td>{this.formatComprobante(comprobantePago.numeroComprobante)}</td>
                <td>{this.formatDate(comprobantePago.fecha)}</td>
                <td>{comprobantePago.numeroFactura}</td>
                <td>{this.formatCurrency(comprobantePago.totalVenta)}</td>
                <td>
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/venta/view/" + comprobantePago.idVenta} >Ver Venta</Button>
                  <Button 
                    variant="primary" href={"/comprobantePago/edit/" + comprobantePago.id} >Editar Comprobante</Button>
                  <Button 
                    id={"print.comprobantePago." + comprobantePago.id} variant="primary" onClick={this.toggleWindowPortal.bind(this, comprobantePago)} >Imprimir Comprobante</Button>
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
        <Form.Group as={Row} controlId="cp.numeroComprobante">
          <Form.Label column sm="2">
            Nro. Comprobante
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="cp.fecha">
          <Form.Label column sm="2">
            Fecha
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={this.formatDate(dto.fecha)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="cp.totalVenta">
          <Form.Label column sm="2">
            Monto total
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={this.formatCurrency(dto.totalVenta)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="cp.numeroFactura">
          <Form.Label column sm="2">
            Nro. Factura
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly={!editable} defaultValue={dto.numeroFactura} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="cp.nota">
          <Form.Label column sm="2">
            Notas
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly={!editable} defaultValue={dto.nota} onChange={this.handleChange}/>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="venta">
          <Form.Label column center sm="12">
            Articulos
          </Form.Label>
        </Form.Group>

        <Table striped bordered hover size="sm">
        <thead>
            <tr>
            <th>Articulo</th>
            <th>P. Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            </tr>
        </thead>
        <tbody align-middle >
            {dto.lineaVentaDtos.map((linea) =>
                <tr>
                <td>{linea.articuloNombre}</td>
                <td>{this.formatCurrency(linea.precio)}</td>
                <td>{(linea.cantidad)}</td>
                <td>{this.formatCurrency(linea.precio * linea.cantidad)}</td>
                </tr>
            )}
        </tbody>
        </Table>

        <Form.Group as={Row} controlId="comprobantePago">
          <Col sm="6">
            <Button variant="primary" href="/comprobantePago/">
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

export default ComprobantePago 