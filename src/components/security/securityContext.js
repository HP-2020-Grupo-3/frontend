import LoginAPI from './loginAPI';


class SecurityContext {

  static setPrincipal(principal) {
    localStorage.setItem("principal", JSON.stringify(principal));
  }

  static async login(dto) {
    const response = await LoginAPI.login(dto);
      if (!response.error) {
          localStorage.setItem("principal", JSON.stringify(response.result));
          return true;
      }
      else {
          return false;
      }
  }

  static logout() {
    console.log("logged out")
    localStorage.removeItem("principal");
  }

  static getPrincipal() {
    return JSON.parse(localStorage.getItem("principal"));
  }
}

export default SecurityContext 