import { UserRoleType, UserRoleVMType } from "@/types/userRole/dto";
import {
  UserRoleRequest_GanNguoiType,
  UserRoleRequestType,
  UserRoleSearchType,
} from "@/types/userRole/request";
import {
  ApiResponse,
  PagedList,
  DropdownOption,
  DropdownOptionTree,
  Dictionary,
  DataImport,
} from "@/types/general";
import { apiService } from "../index";

class UserRoleService {
  private static _instance: UserRoleService;

  public static get instance(): UserRoleService {
    if (!UserRoleService._instance) {
      UserRoleService._instance = new UserRoleService();
    }
    return UserRoleService._instance;
  }
  public async create(
    model: UserRoleRequestType
  ): Promise<ApiResponse<UserRoleType>> {
    try {
      const response = await apiService.post<UserRoleType>(
        `/UserRole/Create`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    model: UserRoleRequestType
  ): Promise<ApiResponse<UserRoleType>> {
    try {
      const response = await apiService.post<UserRoleType>(
        `/UserRole/Update`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async get(id: string): Promise<ApiResponse<UserRoleType>> {
    try {
      const response = await apiService.get<UserRoleType>(
        `/UserRole/Get/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getData(
    search: UserRoleSearchType
  ): Promise<ApiResponse<PagedList<UserRoleType>>> {
    try {
      const response = await apiService.post<PagedList<UserRoleType>>(
        `/UserRole/GetData`,
        search
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(`/UserRole/Delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async createNew(
    model: UserRoleRequest_GanNguoiType
  ): Promise<ApiResponse<UserRoleType[]>> {
    try {
      const response = await apiService.post<UserRoleType[]>(
        `/UserRole/CreateNew`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async setupRole(id: string): Promise<ApiResponse<UserRoleVMType>> {
    try {
      const response = await apiService.post<UserRoleVMType>(
        `/UserRole/SetupRole?id=${id}`,
        null
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const userRoleService = UserRoleService.instance;
export default userRoleService;
