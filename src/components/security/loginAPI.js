import GenericAPI from "../common/genericAPI";


class LoginAPI extends GenericAPI{
  static _endpoint = "login"
  
  static login(dto) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    };

    return this._genericRequest(this._endpoint, requestOptions)
  }
}

export default LoginAPI 