import axios from "axios";
import {adminConfig} from "../config/admin.config";
import {MemberContext} from "./member.context";
import {AdminWebSocket} from "../websocket/admin.websocket";

const API_URL = adminConfig.authentication.authAPI();

class AuthService {
  async login(id, password) {
    const authResponse = await axios.post(API_URL + "/auth", {id, password}, {autoErrorHandling: false})
    const {accessToken} = authResponse.data;
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const memberResponse = await axios.get(API_URL + "/members/my");
    MemberContext.memberInformation = memberResponse.data;
  }

  logout() {
    return axios.post(API_URL + "/auth/logout").then(() => {
      delete axios.defaults.headers['Authorization'];
      MemberContext.memberInformation = null;
    });
  }

  checkAuth() {
    return axios.get(API_URL + "/auth/check");
  }

  async silentRefresh() {
    delete axios.defaults.headers['Authorization'];
    const authResponse = await axios.post(API_URL + "/auth/token/refresh", null, {autoErrorHandling: false})
    const {accessToken} = authResponse.data;
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const memberResponse = await axios.get(API_URL + "/members/my");
    MemberContext.memberInformation = memberResponse.data;
    AdminWebSocket.init(MemberContext.memberInformation.id);
  }

  async loginWithDooray(id, password) {
    const authResponse = await axios.post(API_URL + "/auth/dooray", {id, password}, {autoErrorHandling: false})
    const {accessToken} = authResponse.data;
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const memberResponse = await axios.get(API_URL + "/members/my");
    MemberContext.memberInformation = memberResponse.data;
  }
}

const instance = new AuthService()
export {instance as AuthService}
