import React from 'react';
import GenericComponent from "../common/genericComponent";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { Plus, Trash, Pencil, ZoomIn, CheckSquare, CashStack} from 'react-bootstrap-icons';
import SecurityContext from '../security/securityContext'
import CuentaCorrienteClienteAPI from '../cuentaCorrienteCliente/cuentaCorrienteClienteAPI';
import InputGroup from 'react-bootstrap/InputGroup';
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';

class CuentaCorrienteCliente extends GenericComponent {
    constructor(props) {
      super(props);
      this.api = CuentaCorrienteClienteAPI;
      this.handleUpsert = this.handleUpsert.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleShowModal = this.handleShowModal.bind(this);
      this.handleHideModal = this.handleHideModal.bind(this);
      this.handleShowApproveModal = this.handleShowApproveModal.bind(this);
      this.handleHideApproveModal = this.handleHideApproveModal.bind(this);
      this.handleShowCreateModal = this.handleShowCreateModal.bind(this);
      this.handleHideCreateModal = this.handleHideCreateModal.bind(this);
      this.handleApprove = this.handleApprove.bind(this);
      this.handleCreate = this.handleCreate.bind(this);
      this.handlePago = this.handlePago.bind(this);
      this.handleFilter = this.handleFilter.bind(this);
      var filterFunction = function(cuentaCorrienteCliente, filterText) {return cuentaCorrienteCliente.username.toLowerCase().includes(filterText.toLowerCase())}

      this.state = {
        userRole: null,
        ccToApprove: null,
        usuarioToCreateCC: null,
        showApproveModal: false,
        showCreateModal: null,
        idToDelete: null,
        filterText: "",
        filterBy: "username",
        filterLabel: "Nombre de usuario",
        filterFunction: filterFunction
      };
    }

    async componentDidMount() {
      this.setState({ userRole: SecurityContext.getPrincipal().role });
      
      console.log(this.props.match.params.mode)
      if (!this.props.match.params.mode) {
        this.findAll();
      } else if (this.props.match.params.mode === "view" | this.props.match.params.mode === "edit") {
        // TODO: Validar que exista el id if (!this.props.match.params.id) then mostrar algun error
        this.findById(this.props.match.params.id);
        this.setState({ "editable" : this.props.match.params.mode === "edit" });
      } else if (this.props.match.params.mode === "new") {
        this.createCuentaCorriente();
        this.setState({ "editable" : true,  currentView: 'new' });
      } else if (this.props.match.params.mode === "aprobacion" ) {
        this.findAllNotAprobada();
      } else if (this.props.match.params.mode === "pago" ) {
        const response = await this.api.findById(this.props.match.params.id);
        
        if (!response.error) {
          this.setState({ error: false, isLoaded: true, currentView: 'pago', dto: response.result});
        } else {
          this.errorHandler(response.result);
          this.setState({ error: true, isLoaded: true, currentView: 'pago', dto: response.result });
        }
      }
    }

      handleChange(event) {
        const dto = this.state.dto;
        const total = this.state.total;
        const id = event.target.id;
        var filterText = this.state.filterText;
    
        if (id === "cuentaCorrienteCliente.username"){
          dto.username = event.target.value;      
        } else if (id === "cuentaCorrienteCliente.nombre"){      
          dto.nombre = event.target.value;
        } else if (id === "cuentaCorrienteCliente.apellido"){
          dto.apellido = event.target.value;
        } else if (id.includes("estado.cantidad")){
          dto.estadoCuentaCorrienteDtos
            .filter(estado => estado.id == id.split(".")[2])
            .map(estado => {
              estado.cantidadAPagar = event.target.value;

              return estado
            });
          } else if (id.includes("lineaVenta.aSerPagado")){
            dto.lineasVentaPendienteDePago
            .filter(linea => linea.id == id.split(".")[2])
            .map(linea => {
              linea.aSerPagado = event.target.checked;

              return linea
            });
            console.log(dto.lineasVentaPendienteDePago);
        } else if (id === "filterText"){
          filterText = event.target.value;
        }
        this.setState({dto: dto, filterText: filterText});
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
    
        if (!response.error) {
          this.showOkAlert("La Cuenta Corriente se guardó correctamente.");
          this.setState({
            dto: response.result,
            editable : false
          })
        } else {
          this.showErrorAlert("La Cuenta Corriente no pudo ser guardada.");
        }
        this.handleHideModal();   
      }

      async handleDelete() {
        const { idToDelete, currentView } = this.state;
        var response = await this.api.delete(idToDelete);
        
        if (! response.error && currentView === "aprobacion") {
          this.showOkAlert("La Cuenta Corriente se eliminó correctamente");
          this.setState({
            idToDelete: null,
            showModal: false
          });
          this.findAllNotAprobada()
        } else if (! response.error) {
          this.showOkAlert("La Cuenta Corriente se eliminó correctamente");
          this.setState({
            idToDelete: null,
            showModal: false
          });
          this.findAll()
        } else {
          this.showErrorAlert("La cuenta corriente no pudo ser eliminada")
          this.setState({
            idToDelete: null,
            showModal: false
          })
        }
      }

      async handlePago() {
        const { dto } = this.state;
        dto.usuarioId = SecurityContext.getPrincipal().id;
    
        var response;
        response = await this.api.registerPago(dto);
    
        if (!response.error) {
          this.showOkAlert("El pago se registro correctamente.");
          this.setState({
            dto: response.result,
            editable : false
          })
        } else {
          this.showErrorAlert("El pago no pudo ser guardado.");
        }
        this.handleHideModal();
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
          idToDelete:null
        })
      }  

      handleShowApproveModal(cc) {
        this.setState({
          showApproveModal: true,
          ccToApprove: cc
        })
      } 
      
      handleShowCreateModal(usuario) {
        this.setState({
          showCreateModal: true,
          usuarioToCreateCC: usuario
        })
      }
      
      handleHideApproveModal() {
        this.setState({
          showApproveModal: false,
          ccToApprove: null
        })
      }
      
      handleHideCreateModal() {
        this.setState({
          showCreateModal: false,
          usuarioToApprove: null
        })
      }  
      
      async handleApprove() {
        const { ccToApprove } = this.state;
        ccToApprove.isAprobada = true;
        var response = await this.api.update(ccToApprove);
        this.handleHideApproveModal();
        if (! response.error) {
          this.showOkAlert("Se aprobó la cuenta corriente") 
          this.findAllNotAprobada();
        } else {
          this.showErrorAlert("No se pudo aprobar la cuenta corriente")
        }
      }

      async handleCreate() {
        const { dto,  usuarioToCreateCC } = this.state;

        dto.usuarioId = usuarioToCreateCC.id;
        var response = await this.api.save(dto);
        this.handleHideCreateModal();
        if (! response.error) {
          this.showOkAlert("Se creó la cuenta corriente y debe ser aprobada por un administrador") 
          this.createCuentaCorriente();
        } else {
          this.showErrorAlert("No se pudo crear la cuenta corriente")
        }
      }

      async findAllNotAprobada() {
        const response = await this.api.findAllNotAprobada();
        if (!response.error) {
          this.setState({ error: false, isLoaded: true, currentView: 'aprobacion', dto: response.result});
        } else {
          this.errorHandler(response.result);
          this.setState({ error: true, isLoaded: true, currentView: 'aprobacion', dto: response.result });
        } 
      }

      async createCuentaCorriente() {
        const response = await this.api.getBaseDto();
        if (!response.error) {
          this.setState({ error: false, isLoaded: true, currentView: 'new', dto: response.result});
        } else {
          this.errorHandler(response.result);
          this.setState({ error: true, isLoaded: true, currentView: 'new', dto: response.result });
        }
      }

      handleFilter(param) {
        var filterLabel, filterFunction;
        const filterBy = this.state.filterBy
    
        if (param === "username"){
          filterLabel = "Nombre de usuario";
          filterFunction = function(cuentaCorrienteCliente, filterText) {return cuentaCorrienteCliente.username.toLowerCase().includes(filterText.toLowerCase())}
        } else if (param === "nombre"){
          filterLabel = "Nombre";
          filterFunction = function(cuentaCorrienteCliente, filterText) {return cuentaCorrienteCliente.nombre.toLowerCase().includes(filterText.toLowerCase())}
        } else if (param === "apellido"){
          filterLabel = "Apellido";
          filterFunction = function(cuentaCorrienteCliente, filterText) {return cuentaCorrienteCliente.apellido.toLowerCase().includes(filterText.toLowerCase())}
        } 
        this.setState({ filterBy: param, filterLabel: filterLabel, filterFunction: filterFunction});
      }

      renderList() {
        const { dto, alert, showModal, filterBy, filterLabel, filterText, filterFunction } = this.state;
        var showAprobacion = false;

        if (this.state.userRole === 'ROLE_ADMIN' & dto.cantidadAprobacion > 0) {
          showAprobacion = true;
        }
        return (
          <>
            
            {this.renderModalDialog(
              "¿Está seguro de que desea eliminar esta Cuenta Corriente?", 
              "", 
              this.handleHideModal, 
              this.handleDelete, 
              "Cancelar", 
              "Eliminar", 
              "showModal",
              "danger"
            )}
            <Alert key="0" variant="primary" show={ showAprobacion }>
              Tiene cuentas corrientes pendientes de aprobación  <Button variant="primary" href={"/cuentaCorrienteCliente/aprobacion"} > Ver </Button>
            </Alert>
            <h1>Cuentas Corrientes<Button title="Nueva Cuenta Corriente" variant="primary" href={"/cuentaCorrienteCliente/new"} ><Plus size={25}/></Button></h1>
            {alert}
            <InputGroup className="mb-3">
              <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
                <Dropdown.Item onClick={() => this.handleFilter("username")}>Nombre de usuario</Dropdown.Item>
                <Dropdown.Item onClick={() => this.handleFilter("nombre")}>Nombre</Dropdown.Item>
                <Dropdown.Item onClick={() => this.handleFilter("apellido")}>Apellido</Dropdown.Item>
              </DropdownButton>
              <InputGroup.Text>{filterLabel}</InputGroup.Text>
              <Form.Control type="text" id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
            </InputGroup>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Alta</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {dto.cuentaCorrienteClienteDtos.filter(cuentaCorrienteCliente => filterFunction(cuentaCorrienteCliente, filterText))
                    .map((cuentaCorrienteCliente) =>
                    <tr>
                    <td>{cuentaCorrienteCliente.id}</td>
                    <td>{cuentaCorrienteCliente.username}</td>
                    <td>{cuentaCorrienteCliente.nombre}</td>
                    <td>{cuentaCorrienteCliente.apellido}</td>           
                    <td>{this.formatDate(cuentaCorrienteCliente.fechaCreacion)}</td>
                    <td>
                      <ButtonGroup>
                        <Button title="Ver Detalle"
                          variant="primary" href={"/cuentaCorrienteCliente/view/" + cuentaCorrienteCliente.id} ><ZoomIn size={20}/></Button>
                        <Button title="Editar"
                          variant="primary" href={"/cuentaCorrienteCliente/edit/" + cuentaCorrienteCliente.id} ><Pencil size={20}/></Button>
                        <Button title="Registrar Pago"
                          variant="primary" href={"/cuentaCorrienteCliente/pago/" + cuentaCorrienteCliente.id} ><CashStack size={20}/></Button>
                        <Button title="Eliminar"
                          id={"delete.cuentaCorrienteCliente." + cuentaCorrienteCliente.id} variant="danger" onClick={this.handleShowModal.bind(this, cuentaCorrienteCliente.id)} ><Trash size={20}/></Button>
                      </ButtonGroup>
                    </td>
                    </tr>
                )}
            </tbody>
            </Table>
          </>
        );
      }
    
      renderAprobacion() {
        const { dto, alert, showModal, filterBy, filterLabel, filterText, filterFunction } = this.state;
        return (
          <>
            {this.renderModalDialog(
              "¿Está seguro de que desea eliminar esta Cuenta Corriente?", 
              "", 
              this.handleHideModal, 
              this.handleDelete, 
              "Cancelar", 
              "Eliminar", 
              "showModal",
              "danger"
            )}           
            {this.renderModalDialog(
              "¿Está seguro que desea aprobar la Cuenta Corriente?", 
              "", 
              this.handleHideApproveModal, 
              this.handleApprove, 
              "Cancelar", 
              "Aprobar", 
              "showApproveModal",
              "success"
            )}
            <h1>Aprobaciones Pendientes</h1>
            {alert}
            <InputGroup className="mb-3">
              <DropdownButton variant="secondary" title="Filtrar por " id="input-group-dropdown-1">
                <Dropdown.Item onClick={() => this.handleFilter("username")}>Nombre de usuario</Dropdown.Item>
                <Dropdown.Item onClick={() => this.handleFilter("nombre")}>Nombre</Dropdown.Item>
                <Dropdown.Item onClick={() => this.handleFilter("apellido")}>Apellido</Dropdown.Item>
              </DropdownButton>
              <InputGroup.Text>{filterLabel}</InputGroup.Text>
              <Form.Control type="text" id="filterText" placeholder="escriba aquí para filtrar" onChange={this.handleChange}  />
            </InputGroup>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Alta</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {dto.filter(cuentaCorrienteClienteAprobacion => filterFunction(cuentaCorrienteClienteAprobacion, filterText))
                    .map((cuentaCorrienteClienteAprobacion) =>
                    <tr>
                    <td>{cuentaCorrienteClienteAprobacion.id}</td>
                    <td>{cuentaCorrienteClienteAprobacion.username}</td>
                    <td>{cuentaCorrienteClienteAprobacion.nombre}</td>
                    <td>{cuentaCorrienteClienteAprobacion.apellido}</td>           
                    <td>{this.formatDate(cuentaCorrienteClienteAprobacion.fechaCreacion)}</td>
                    <td>
                      <ButtonGroup>
                        <Button title="Aprobar Cuenta Corriente"
                          variant="success" onClick={this.handleShowApproveModal.bind(this, cuentaCorrienteClienteAprobacion)}><CheckSquare size={20}/></Button>
                        <Button title="Ver Detalle"
                          variant="primary" href={"/cuentaCorrienteCliente/view/" + cuentaCorrienteClienteAprobacion.id} ><ZoomIn size={20}/></Button>
                        <Button title="Cancelar Cuenta Corriente"
                          variant="danger" onClick={this.handleShowModal.bind(this, cuentaCorrienteClienteAprobacion.id) } ><Trash size={20}/></Button>
                      </ButtonGroup>
                    </td>
                    </tr>
                )}
                
            </tbody>
            </Table>
            <Form.Group as={Row} controlId="rubro">
              <Col sm="6">
                <Button variant="primary" href={"/cuentaCorrienteCliente/"} >Volver</Button>
              </Col>
            </Form.Group>
          </>
        );
      }

      renderPago() {
        const { dto, editable, alert } = this.state;

        return (
          <Form>
            {alert}
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Id
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" readOnly defaultValue={dto.id} />
              </Col>
              <Form.Label column sm="2">
                Username
              </Form.Label>
              <Col sm="6">
                <Form.Control type="text" id="cuentaCorrienteCliente.username"  readOnly={!editable} defaultValue={dto.username} onChange={this.handleChange}/>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Apellido
              </Form.Label>
              <Col sm="4">
                <Form.Control type="text" id="cuentaCorrienteCliente.apellido" readOnly={!editable} defaultValue={dto.apellido} onChange={this.handleChange}/>
              </Col> 
              <Form.Label column sm="2">
                Nombre
              </Form.Label>
              <Col sm="4">
                <Form.Control type="text" id="cuentaCorrienteCliente.nombre" readOnly={!editable} defaultValue={dto.nombre} onChange={this.handleChange}/>
              </Col>
              </Form.Group>

            <hr />

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Form.Label column center sm="12"><h4>Estado</h4></Form.Label>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Table striped bordered hover>
              <thead>
                  <tr>
                  <th>Articulo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Cantidad Pagar</th>
                  <th>Subtotal Pagar</th>
                  </tr>
              </thead>
              <tbody>
                  {dto.estadoCuentaCorrienteDtos.filter(a => a.cantidad > 0).sort((a, b) => b.id - a.id).map((estado) =>
                      <tr>
                      <td>{estado.articulo.nombre}</td>
                      <td>{estado.cantidad}</td>
                      <td>{this.formatCurrency(estado.precio.valor)}</td>
                      {/* <td>{this.formatCurrency(estado.precio.valor * estado.cantidad)}</td> */}
                      <td>
                        <Form.Control type="number" id={"estado.cantidad." + estado.id} defaultValue={0} value={estado.cantidadAPagar} min={0} max={estado.cantidad} onChange={this.handleChange}/>
                      </td>
                      <td>{this.formatCurrency(estado.precio.valor * estado.cantidadAPagar)}</td>
                      </tr>
                  )}
              </tbody>
            </Table>
            </Form.Group>

            <hr />

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Form.Label column center sm="12"><h4>Ventas con Precio Congelado</h4></Form.Label>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Table striped bordered hover>
              <thead>
                  <tr>
                  <th>Articulo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th>Pagar</th>
                  <th>Subtotal Pagar</th>
                  </tr>
              </thead>
              <tbody>
                  {dto.lineasVentaPendienteDePago.sort((a, b) => b.id - a.id).map((lineaVenta) =>
                      <tr>
                      <td>{lineaVenta.articuloNombre}</td>
                      <td>{lineaVenta.cantidad}</td>
                      <td>{this.formatCurrency(lineaVenta.precio)}</td>
                      <td>{this.formatCurrency(lineaVenta.precio * lineaVenta.cantidad)}</td>
                      <td>
                        <Form.Check type="switch" id={"lineaVenta.aSerPagado." + lineaVenta.id} label="" checked={lineaVenta.aSerPagado} onChange={this.handleChange} />
                      </td>
                      <td>{lineaVenta.aSerPagado ? this.formatCurrency(lineaVenta.precio * lineaVenta.cantidad) : this.formatCurrency(0)}</td>
                      </tr>
                  )}
              </tbody>
            </Table>
            </Form.Group>

            <Form.Group as={Row} controlId="venta">
              <Form.Label column center sm="8"></Form.Label>
              <Form.Label column center sm="2">
                Total
              </Form.Label>
              <Col sm="2">
                <Form.Control plaintext readOnly 
                  value={
                    this.formatCurrency(
                      dto.estadoCuentaCorrienteDtos.map(a => a.precio.valor * a.cantidadAPagar).reduce((a, b) => a + b, 0) +
                      dto.lineasVentaPendienteDePago.filter(a => a.aSerPagado).map(a => a.precio * a.cantidad).reduce((a, b) => a + b, 0) 
                    )} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Col sm="6">
                <Button variant="primary" onClick={this.props.history.goBack}>
                  Volver
                </Button>
              </Col>
              <Col sm="6">
                <Button variant="success" onClick={this.handlePago}>
                  Pagar
                </Button>
              </Col>
            </Form.Group>
          </Form>
        )

      }
      
      renderAlta(){
        const { dto, alert} = this.state;

        return (
          <>          
          {this.renderModalDialog(
            "¿Está seguro que desea crear una Cuenta Corriente para este usuario?", 
            "", 
            this.handleHideCreateModal, 
            this.handleCreate, 
            "Cancelar", 
            "Crear", 
            "showCreateModal",
            "success"
          )}
          <h1>Alta de Cuenta Corriente</h1>
          <br></br>
          <h3>Seleccione el usuario</h3>
          {alert}
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>E-mail</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {dto.usuarioCCDtos.map((usuario) =>
                    <tr>
                    <td>{usuario.id}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>           
                    <td>{usuario.email}</td>
                    <td>
                      <ButtonGroup>
                        <Button 
                          variant="success" title="Crear Cuenta Corriente" onClick={this.handleShowCreateModal.bind(this, usuario)}><CheckSquare size={20}/></Button>
                        <Button 
                          variant="primary" title="Ver Usuario" href={"/usuario/view/" + usuario.id} ><ZoomIn size={20}/></Button>
                      </ButtonGroup>
                    </td>
                    </tr>
                )}
            </tbody>
            </Table>
            <Form.Group as={Row} controlId="rubro">
              <Col sm="6">
                <Button variant="primary" href={"/cuentaCorrienteCliente/"} >Volver</Button>
              </Col>
            </Form.Group>
          </>
        );
      }

      renderSingle() {
        const { dto, editable, alert } = this.state;
        
        return (
          <Form>
            {alert}
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Id
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" readOnly defaultValue={dto.id} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Username
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" id="cuentaCorrienteCliente.username"  readOnly={!editable} defaultValue={dto.username} onChange={this.handleChange}/>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Nombre
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" id="cuentaCorrienteCliente.nombre" readOnly={!editable} defaultValue={dto.nombre} onChange={this.handleChange}/>
              </Col>
              </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
              <Form.Label column sm="2">
                Apellido
              </Form.Label>
              <Col sm="10">
                <Form.Control type="text" id="cuentaCorrienteCliente.apellido" readOnly={!editable} defaultValue={dto.apellido} onChange={this.handleChange}/>
              </Col> 
            </Form.Group>

            <hr />

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Form.Label column center sm="12"><h4>Estado</h4></Form.Label>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Table striped bordered hover>
              <thead>
                  <tr>
                  <th>Articulo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {dto.estadoCuentaCorrienteDtos.filter(a => a.cantidad > 0).sort((a, b) => b.id - a.id).map((estado) =>
                      <tr>
                      <td>{estado.articulo.nombre}</td>
                      <td>{estado.cantidad}</td>
                      <td>{this.formatCurrency(estado.precio.valor)}</td>
                      <td>{this.formatCurrency(estado.precio.valor * estado.cantidad)}</td>
                      </tr>
                  )}
              </tbody>
            </Table>
            </Form.Group>

            <hr />

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Form.Label column center sm="12"><h4>Ventas con Precio Congelado</h4></Form.Label>
            </Form.Group>
            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
            <Table striped bordered hover>
              <thead>
                  <tr>
                  <th>Articulo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {dto.lineasVentaPendienteDePago.sort((a, b) => b.id - a.id).map((lineaVenta) =>
                      <tr>
                      <td>{lineaVenta.articuloNombre}</td>
                      <td>{lineaVenta.cantidad}</td>
                      <td>{this.formatCurrency(lineaVenta.precio)}</td>
                      <td>{this.formatCurrency(lineaVenta.precio * lineaVenta.cantidad)}</td>
                      </tr>
                  )}
              </tbody>
            </Table>
            </Form.Group>

            <Form.Group as={Row} controlId="cuentaCorrienteCliente">
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
        const { error, isLoaded, currentView, dto, userRole} = this.state;
        
        if (error) {
          return <div>Error: {dto.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          switch (currentView) {
            case 'list':
              return this.renderList();
            case 'single':
              return this.renderSingle();
            case 'aprobacion':
              return this.renderAprobacion();
            case 'pago':
              return this.renderPago();
            case 'new':
              return this.renderAlta();
            default:
              return this.renderList();
          }
        }
      }
}

export default CuentaCorrienteCliente