import React from 'react';
import PredictiveComboBox from '../ui/predictiveComboBox';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PredictiveComboBoxArticulo extends PredictiveComboBox {
  constructor(props) {
    super(props);
  }

  renderSuggestion(suggestion) {
    const { displayProperty } = this.props
    return (
        <Container>
        <Row>
            <div class="col-md-9 col-lg-9 col-sm-8 col-xs-12 float-left-style">{suggestion[displayProperty]} {}</div>
            <div class='text-right font-italic'>$ {suggestion.precio.toFixed(2)}</div>
        </Row>
        <Row>
            <Col><small>{suggestion.descripcion}  </small></Col>
        </Row>
        </Container>
    )
  }
}

export default PredictiveComboBoxArticulo