import { ApiResponse } from "@/types/general";

import { AppUserType, LoginResponseType } from "@/types/appUser/dto";
import { apiService } from "..";
import { LoginViewModelType } from "@/types/appUser/request";

class AuthService {
  private static _instance: AuthService;
  public static get instance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }
    return AuthService._instance;
  }

  public async login(
    model: LoginViewModelType
  ): Promise<ApiResponse<LoginResponseType>> {
    try {
      const response = await apiService.post<LoginResponseType>(
        `/Account/Login`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async logout(): Promise<ApiResponse> {
    try {
      const response = await apiService.post(`/Account/Logout`, null);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getInfo(): Promise<ApiResponse<AppUserType>> {
    try {
      const response = await apiService.get<AppUserType>(`/Account/GetInfo`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
const authService = AuthService.instance;
export default authService;
