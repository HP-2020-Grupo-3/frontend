import GenericAPI from "../common/genericAPI";


class CuentaCorrienteClienteAPI extends GenericAPI{
  static _endpoint = "cuentaCorrienteCliente"  

  static findAllNotAprobada() {
    return this._genericRequest(this._endpoint + "/aprobacion");
  }
}

export default CuentaCorrienteClienteAPI