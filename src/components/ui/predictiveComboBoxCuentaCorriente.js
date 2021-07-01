import React from 'react';
import PredictiveComboBox from './predictiveComboBox';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PredictiveComboBoxCuentaCorriente extends PredictiveComboBox {
  constructor(props) {
    super(props);
  }

  getSuggestions(value) {

    const {availableItems, displayProperty} = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputValue === '') {
      return [];
    }
    
    return inputLength === 0 ? [] : availableItems.filter(item => (item.nombre + item.apellido + item.username).toLowerCase().includes(inputValue))
  }


  renderSuggestion(suggestion) {
    const { displayProperty } = this.props
    console.log(suggestion);
    return (
        <Container>
        <Row>
            <div class="col-md-9 col-lg-9 col-sm-8 col-xs-12 float-left-style">{suggestion.apellido} {suggestion.nombre}</div>
        </Row>
        <Row>
            <Col><small>{suggestion.username}  </small></Col>
        </Row>
        </Container>
    )
  }
}

export default PredictiveComboBoxCuentaCorriente