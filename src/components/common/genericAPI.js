import SecurityContext from '../security/securityContext'


class GenericAPI {
    static _baseUrl = "https://venidemary.herokuapp.com/";
 
    static _genericRequest(endpoint, requestOptions={}) {

      if (SecurityContext.getPrincipal()) {
        if (!requestOptions["headers"]) {
          requestOptions.headers = {};
        }
        requestOptions.headers.Authorization = SecurityContext.getPrincipal().token;
      }
      console.log("Request endpoint: " + this._baseUrl + endpoint);
      console.log("Request options: " + JSON.stringify(requestOptions));
      return fetch(this._baseUrl + endpoint, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if (!result.error) {
              console.log("Request result: " + JSON.stringify(result));
              return {error: false, result: result}              
            } else {
              console.log("Request failed: " + JSON.stringify(result));
              return {error: true, result: result}              
            }
          })
          .catch((error) => {
            console.log("Request error: " + JSON.stringify(error))
            return {error: true, result: error}
            }
          );
    }
  
    static findAll() {
      return this._genericRequest(this._endpoint)
    }
    
    static getBaseDto() {
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