import GenericAPI from "../common/genericAPI";


class CuentaCorrienteClienteAPI extends GenericAPI{
  static _endpoint = "cuentaCorrienteCliente"  

  static findAllNotAprobada() {
    return this._genericRequest(this._endpoint + "/aprobacion");
  }

  static registerPago(dto) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    };
    
    return this._genericRequest(this._endpoint + "/pago", requestOptions)
  }
}

export default CuentaCorrienteClienteAPI