import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Autosuggest from 'react-autosuggest';
import { Trash, Pencil, ZoomIn } from 'react-bootstrap-icons';


class GenericComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dto: null,
      alert: null,
      showModal: false,
    };
  }
  
  async errorHandler(result) {
    if (result.status === 401) {
      this.props.history.push("/shop");
    } else if (result.status === 403) {
      this.props.history.push("/shop");
    }
  }

  async findAll() {
    const response = await this.api.findAll();
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'list', dto: response.result});
    } else {
      this.errorHandler(response.result);
      this.setState({ error: true, isLoaded: true, currentView: 'list', dto: response.result });
    } 
  }

  async findById(id) {
    const response = await this.api.findById(id);
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'single', dto: response.result});
    } else {
      this.errorHandler(response.result);
      this.setState({ error: true, isLoaded: true, currentView: 'single', dto: response.result });
    }
  }

  async getBaseDto() {
    const response = await this.api.getBaseDto();
    if (!response.error) {
      this.setState({ error: false, isLoaded: true, currentView: 'single', dto: response.result});
    } else {
      this.errorHandler(response.result);
      this.setState({ error: true, isLoaded: true, currentView: 'single', dto: response.result });
    }
  }

  // UI Functions

  renderComboBox(id, currentItem, availableItems, editable, displayProperty = "nombre") {

    return (
    <Form.Control as="Select" type="text" 
      id={id}
      disabled={!editable}
      onChange={this.handleChange}>
        <option key={currentItem.id} value={JSON.stringify(currentItem)}>{currentItem[displayProperty]}</option>
 
      { availableItems ?
          availableItems
            .filter(r => r.id !== currentItem.id)
            .sort( (a, b) => {
              if (a[displayProperty] > b[displayProperty]) {
                return 1;
              } else {
                return -1
              }
            } )
            .map( (availableItem) => {
            return (<option key={availableItem.id} value={JSON.stringify(availableItem)}>{availableItem[displayProperty]}</option>)
          })
        : (<option value="-1">Sin datos</option>)
      }
    </Form.Control>
    )
  }

  renderModalDialog(title, body, handleCancel, handleOk, cancelText = "Cancelar", okText = "Aceptar") {
    return (
      <Modal show={this.state.showModal} onHide={handleCancel} >
        <Modal.Title>{title}</Modal.Title>
        <Modal.Body><p>{body}</p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} >
            {cancelText}
          </Button>
          <Button variant="danger" onClick={handleOk}>
            {okText}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  showAlert(message, variant) {
    window.scrollTo(0, 0)
    this.setState({alert: (
      <Alert key="0" variant={variant}>
        {message}
      </Alert>
    )})
  }

  showOkAlert(message) {
    this.showAlert(message, "success")
  }
  
  showErrorAlert(message) {
    this.showAlert(message, "danger")
  }

  // renderActionButtonGroup(id) {
  //   return (
  //     <ButtonGroup>
  //       <Button 
  //         variant="primary" href={"/articulo/view/" + id} ><ZoomIn size={20}/></Button>
  //       <Button 
  //         variant="primary" href={"/articulo/edit/" + id} ><Pencil size={20}/></Button>
  //       <Button 
  //         id={"delete.articulo." + id} variant="danger" onClick={this.handleShowModal} ><Trash size={20}/></Button>
  //     </ButtonGroup>
  //   )
  // }

  // Format Functions

  formatCurrency(number) {
    return "$ " + number.toFixed(2);
  }

  formatDate(dateString) {

    if (!dateString) {
      return "" 
    }

    return new Intl.DateTimeFormat( "es-AR", {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,}).format(Date.parse(dateString))
  }

  formatComprobante(number) {
    var str;

    if (!number) {
      str = ""      
    } else {
      str = number.toString();
    }
    while (str.length < 6) str = "0" + str;

    return str
  }

}
  
  export default GenericComponent