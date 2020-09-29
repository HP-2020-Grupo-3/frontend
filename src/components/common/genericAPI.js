

class GenericAPI {
    static _baseUrl = "http://localhost:8080/";
 
    static _genericRequest(endpoint, requestOptions={}) {
      return fetch(this._baseUrl + endpoint, requestOptions)
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
      return this._genericRequest(this._endpoint)
    }
    
    static base() {
      return this._genericRequest(this._endpoint + "/new")
    }
    
    static findById(id) {
      return this._genericRequest(this._endpoint + "/" + id)
    }
    
    static update(dto) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      };
      
      return this._genericRequest(this._endpoint, requestOptions)
    }
    
    static delete(id) {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      };
  
      return this._genericRequest(this._endpoint + "/" + id, requestOptions)
    }

    static save(dto) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      };
  
      return this._genericRequest(this._endpoint, requestOptions)
    }
  }
  
  export default GenericAPI 