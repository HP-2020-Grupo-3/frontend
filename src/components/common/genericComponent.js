import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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

}
  
  export default GenericComponent