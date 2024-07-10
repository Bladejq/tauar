import API from "../api/axios.config"

class UserService {
    getUser() {
        return API.get(`/auth/status`);
    }

    register(credentials) {
        return API.post(`/auth/register`, credentials);
    }

    login(credentials) {
        return API.post(`/auth/login`, credentials);
    }

    logout() {
        return API.post(`/auth/logout`);
    }
  }
  
  export default new UserService();