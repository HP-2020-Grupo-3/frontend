

class RubroAPI {
  // esta baseUrl tiene que ser eredada de la superclase.
  static _baseUrl = "http://localhost:8080/"
  static _endpoint = "rubro";

  // constructor() {
  // }

  static _genericRequest(endpoint, requestOptions={}) {
    return fetch(RubroAPI._baseUrl + endpoint, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          return {error: false, result: result}
        },
        (error) => {
          console.log(error)
          return {error: true, result: error}
          });
  }

  static findAll() {
    return RubroAPI._genericRequest(RubroAPI._endpoint)
  }
  
  static findById(id) {
    return RubroAPI._genericRequest(RubroAPI._endpoint + "/" + id)
  }
  
  static update(dto) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    };
    
    return RubroAPI._genericRequest(RubroAPI._endpoint, requestOptions)
  }
  
  static delete(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    };

    return RubroAPI._genericRequest(RubroAPI._endpoint + "/" + id, requestOptions)
  }
}

export default RubroAPI 