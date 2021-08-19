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
import DescuentoAPI from '../descuento/descuentoAPI';

class Descuento extends GenericComponent {
  constructor(props) {
    super(props);
    this.api = DescuentoAPI;
    this.handleUpsert = this.handleUpsert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
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

    if (id === "descuento.valor"){
        dto.displayText = event.target.value;
        dto.valor = (dto.displayText.replace("%",""))/100;      
      } else if (id === "descuento.isHabilitado"){      
        dto.isHabilitado = event.target.checked;
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
          El descuento se guardó correctamente.
        </Alert>
        ),
        dto: response.result
      })
    } else {
      this.setState({alert: (
        <Alert key="0" variant="danger">
          El descuento no pudo ser guardado.
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

  renderList() {
    const { dto, alert, showModal } = this.state;
    return (
      <>
        <h1>Descuentos<Button variant="primary" href={"/descuento/new"} ><Plus size={25}/></Button></h1>
        {alert}
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Valor</th>
            <th>Habilitado</th>
            </tr>
        </thead>
        <tbody>
            {dto.map((descuento) =>
                <tr>
                <td>{descuento.id}</td>
                <td>{descuento.displayText}</td>
                <td>{descuento.isHabilitado ? "SI" : "NO"}</td>
                <td>
                <ButtonGroup>
                  <Button 
                    variant="primary" href={"/descuento/view/" + descuento.id} >Ver</Button>
                  <Button 
                    variant="primary" href={"/descuento/edit/" + descuento.id} >Editar</Button>
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
    var nuevo = false;
    if (this.props.match.params.mode === "new"){
        nuevo=true;
    } else {
        nuevo = false;
    }
    return (
      <Form>
        {alert}
        <Form.Group as={Row} controlId="descuento">
          <Form.Label column sm="2">
            Id
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" readOnly defaultValue={dto.id} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="descuento">
          <Form.Label column sm="2">
            Valor
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" id="descuento.valor" readOnly={!nuevo} defaultValue={dto.displayText} onChange={this.handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="descuento">
          <Form.Label column sm="2">
            Habilitado
          </Form.Label>
          <Col sm="1">
            <Form.Check type="switch" id="descuento.isHabilitado" label="" 
                disabled={!editable} checked={dto.isHabilitado} onChange={this.handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="descuento">
          <Col sm="6">
            <Button variant="primary" onClick={this.props.history.goBack}>
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

export default Descuento 