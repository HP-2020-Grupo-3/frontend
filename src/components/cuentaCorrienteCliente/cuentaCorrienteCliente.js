import React from 'react';
import GenericComponent from "../common/genericComponent";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { Plus, Trash, Pencil, ZoomIn, CheckSquare } from 'react-bootstrap-icons';
import SecurityContext from '../security/securityContext'
import CuentaCorrienteClienteAPI from '../cuentaCorrienteCliente/cuentaCorrienteClienteAPI';

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
      
      this.setState({
        userRole: null,
        ccToApprove: null,
        usuarioToCreateCC: null,
        showApproveModal: false,
        showCreateModal: null,
        idToDelete: null
      });
    }

    async componentDidMount() {
      this.setState({ userRole: SecurityContext.getPrincipal().role });

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
      }
    }

      handleChange(event) {
        const dto = this.state.dto;
        const id = event.target.id;
    
        if (id === "cuentaCorrienteCliente.username"){
          dto.username = event.target.value;      
        } else if (id === "cuentaCorrienteCliente.nombre"){      
          dto.nombre = event.target.value;
        } else if (id === "cuentaCorrienteCliente.apellido"){
          dto.apellido = event.target.value;
        }
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

      renderList() {
        const { dto, alert, showModal } = this.state;
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
            <h1>Cuentas Corrientes<Button variant="primary" href={"/cuentaCorrienteCliente/new"} ><Plus size={25}/></Button></h1>
            {alert}
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
                {dto.cuentaCorrienteClienteDtos.map((cuentaCorrienteCliente) =>
                    <tr>
                    <td>{cuentaCorrienteCliente.id}</td>
                    <td>{cuentaCorrienteCliente.username}</td>
                    <td>{cuentaCorrienteCliente.nombre}</td>
                    <td>{cuentaCorrienteCliente.apellido}</td>           
                    <td>{this.formatDate(cuentaCorrienteCliente.fechaCreacion)}</td>
                    <td>
                      <ButtonGroup>
                        <Button 
                          variant="primary" href={"/cuentaCorrienteCliente/view/" + cuentaCorrienteCliente.id} ><ZoomIn size={20}/></Button>
                        <Button 
                          variant="primary" href={"/cuentaCorrienteCliente/edit/" + cuentaCorrienteCliente.id} ><Pencil size={20}/></Button>
                        <Button 
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
        const { dto, alert, showModal } = this.state;
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
                {dto.map((cuentaCorrienteClienteAprobacion) =>
                    <tr>
                    <td>{cuentaCorrienteClienteAprobacion.id}</td>
                    <td>{cuentaCorrienteClienteAprobacion.username}</td>
                    <td>{cuentaCorrienteClienteAprobacion.nombre}</td>
                    <td>{cuentaCorrienteClienteAprobacion.apellido}</td>           
                    <td>{this.formatDate(cuentaCorrienteClienteAprobacion.fechaCreacion)}</td>
                    <td>
                      <ButtonGroup>
                        <Button 
                          variant="success" onClick={this.handleShowApproveModal.bind(this, cuentaCorrienteClienteAprobacion)}><CheckSquare size={20}/></Button>
                        <Button 
                          variant="primary" href={"/cuentaCorrienteCliente/view/" + cuentaCorrienteClienteAprobacion.id} ><ZoomIn size={20}/></Button>
                        <Button 
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
                          variant="success" onClick={this.handleShowCreateModal.bind(this, usuario)}><CheckSquare size={20}/></Button>
                        <Button 
                          variant="primary" href={"/usuario/view/" + usuario.id} ><ZoomIn size={20}/></Button>
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
            case 'new':
              return this.renderAlta();
            default:
              return this.renderList();
          }
        }
      }
}

export default CuentaCorrienteCliente