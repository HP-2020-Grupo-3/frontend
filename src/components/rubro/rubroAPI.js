

class RubroAPI {
  // esta baseUrl tiene que ser eredada de la superclase.
  static _baseUrl = "http://localhost:8080/"
  static _endpoint = "rubro";

  // constructor() {
  // }

  static _genericRequest(endpoint) {
    return fetch(endpoint)
      .then(res => res.json())
      .then(
        (result) => {
          return {error: false, result: result}
        },
        (error) => {
          return {error: true, result: error}
          });
  }

  static findAll() {
    return RubroAPI._genericRequest(RubroAPI._baseUrl + RubroAPI._endpoint)
  }
  
  static findById(id) {
    return RubroAPI._genericRequest(RubroAPI._baseUrl + RubroAPI._endpoint + "/" + id)
  }
}

export default RubroAPI 