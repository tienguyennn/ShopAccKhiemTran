import {
  MenuDataType,
  ModuleMenuDTOType,
  OperationType,
} from "@/types/operation/dto";
import {
  OperationRequestType,
  OperationSearchType,
} from "@/types/operation/request";
import {
  ApiResponse,
  PagedList,
  DropdownOption,
  DropdownOptionTree,
  Dictionary,
  DataImport,
} from "@/types/general";
import { apiService } from "../index";
class OperationService {
  private static _instance: OperationService;
  public static get instance(): OperationService {
    if (!OperationService._instance) {
      OperationService._instance = new OperationService();
    }
    return OperationService._instance;
  }
  public async create(
    model: OperationRequestType
  ): Promise<ApiResponse<OperationType>> {
    try {
      const response = await apiService.post<OperationType>(
        `/Operation/Create`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    model: OperationRequestType
  ): Promise<ApiResponse<OperationType>> {
    try {
      const response = await apiService.put<OperationType>(
        `/Operation/Update`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async get(id: string): Promise<ApiResponse<OperationType>> {
    try {
      const response = await apiService.get<OperationType>(
        `/Operation/Get/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getData(
    search: OperationSearchType
  ): Promise<ApiResponse<PagedList<OperationType>>> {
    try {
      const response = await apiService.post<PagedList<OperationType>>(
        `/Operation/GetData`,
        search
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(`/Operation/Delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getMenu(): Promise<ApiResponse<MenuDataType[]>> {
    try {
      const response = await apiService.post<MenuDataType[]>(
        `/Operation/GetMenu`,
        null
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getConfigOperation(
    roleId: string
  ): Promise<ApiResponse<ModuleMenuDTOType[]>> {
    try {
      const response = await apiService.post<ModuleMenuDTOType[]>(
        `/Operation/GetConfigOperation?roleId=${roleId}`,
        null
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getBreadcrumb(): Promise<ApiResponse<any>> {
    try {
      const response = await apiService.get<any>(`/Operation/GetBreadcrumb`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const operationService = OperationService.instance;
export default operationService;
