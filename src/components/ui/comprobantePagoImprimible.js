import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GenericComponent from '../common/genericComponent';

class ComprobantePagoImprimible extends GenericComponent {
    constructor(props) {
      super(props);
      this.state = {
        hideButtons: false
      }
    }

   async hideButtons() {
      this.setState({ hideButtons: true});
      await this.sleep(100);
      this.setState({ hideButtons: false});
    }

    render() {
      console.log("comprobantePago", this.props.comprobantePago);
      const subtotal = this.props.comprobantePago.lineaVentaDtos.reduce((acc, linea) => acc += linea.precio * linea.cantidad, 0 );
      const total = subtotal - (subtotal * this.props.comprobantePago.descuento.valor);
      return (
        <Form>
          <Col sm="1"/>
          <Col>
            <hr />
            <Form.Group as={Row} controlId="tituloComprobante">
              <Col sm="4"/>
              <Col sm="4" >
                <Form.Label column center >
                 Vení de Mary
                </Form.Label>
              </Col>
              <Col sm="4"/>
            </Form.Group>
            <hr />
            <br/>
            <Form.Group as={Row} controlId="encabezadoComprobante">
              <Form.Label column sm="3">
                 Comprobante Nro.
              </Form.Label>
              <Form.Label column sm="3">
                {this.formatComprobante(this.props.comprobantePago.numeroComprobante)}
              </Form.Label>
              <Form.Label column sm="2">
                Fecha
              </Form.Label>
             <Form.Label column sm="4">
               {this.formatDate(this.props.comprobantePago.fecha)}
              </Form.Label>
            </Form.Group>
            <hr />
            <br />
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
                {this.props.comprobantePago.lineaVentaDtos.map((linea) =>
                  <tr>
                  <td>{linea.articuloNombre}</td>
                  <td>{this.formatCurrency(linea.precio)}</td>
                  <td>{linea.cantidad}</td>
                  <td>{this.formatCurrency(linea.precio * linea.cantidad)}</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <br/>
            <Form.Group as={Row} controlId="subtotal">
              <Form.Label column center sm="6"></Form.Label>
              <Form.Label column center sm="2">
              Subtotal
              </Form.Label>
              <Col sm="2">
                <Form.Label plaintext >
                  {this.formatCurrency(subtotal)}
                </Form.Label>              
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="descuento">
              <Form.Label column center sm="6"></Form.Label>
              <Form.Label column center sm="2">
                Descuento
              </Form.Label>
              <Col sm="2">
                <Form.Label plaintext >
                  {this.props.comprobantePago.descuento.displayText}
                </Form.Label>              
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="total">
              <Form.Label column center sm="6"></Form.Label>
              <Form.Label column center sm="2">
                Total
              </Form.Label>
              <Col sm="2">
                <Form.Label plaintext >
                  {this.formatCurrency(total)}
                </Form.Label>              
              </Col>
            </Form.Group>
            <hr/>
            <br/>
            <Form.Group as={Row}>
              <Col />
              <Col>
                <Button hidden={this.state.hideButtons} onClick={() => this.props.closeWindowPortal()}>Cancelar</Button>
              </Col>
              <Col>
                <Button href="javascript:window.print()" hidden={this.state.hideButtons} onClick={()=> this.hideButtons()} >Imprimir</Button>
              </Col>
              <Col/>
            </Form.Group>
          </Col>
          <Col sm="1"/>
        </Form>
        )
    }
  }

export default ComprobantePagoImprimible;