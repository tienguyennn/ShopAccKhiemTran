import {
  ApiResponse,
  PagedList,
} from "@/types/general";
import { apiService } from "../index";

export interface IAccount {
  id: string;
  accountCode: string;
  gameType: string;
  rank: string;
  price: number;
  sellerId: string;
  description?: string;
  status?: string;
  isPublished: boolean;
  imageUrl?: string;
  images?: string;
  rating: number;
  soldCount: number;
  createdDate?: string;
  createdBy?: string;
}

export interface IAccountSearch {
  pageIndex: number;
  pageSize: number;
  gameType?: string;
  rank?: string;
  status?: string;
  priceFrom?: number;
  priceTo?: number;
  isPublished?: boolean;
  searchText?: string;
}

class AccountService {
  private static _instance: AccountService;

  public static get instance(): AccountService {
    if (!AccountService._instance) {
      AccountService._instance = new AccountService();
    }
    return AccountService._instance;
  }

  public async create(model: Partial<IAccount>): Promise<ApiResponse<IAccount>> {
    try {
      const response = await apiService.post<IAccount>("/Account/Create", model);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: string,
    model: Partial<IAccount>
  ): Promise<ApiResponse<IAccount>> {
    try {
      const response = await apiService.put<IAccount>(
        `/Account/Update/${id}`,
        model
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async get(id: string): Promise<ApiResponse<IAccount>> {
    try {
      const response = await apiService.get<IAccount>(`/Account/Get/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getData(
    search: IAccountSearch
  ): Promise<ApiResponse<PagedList<IAccount>>> {
    try {
      const response = await apiService.post<PagedList<IAccount>>(
        "/Account/GetData",
        search
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<ApiResponse> {
    try {
      const response = await apiService.delete(`/Account/Delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async publish(id: string, isPublish: boolean): Promise<ApiResponse<IAccount>> {
    try {
      const response = await apiService.put<IAccount>(
        `/Account/Publish/${id}`,
        isPublish
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getByGameType(gameType: string): Promise<ApiResponse<IAccount[]>> {
    try {
      const response = await apiService.get<IAccount[]>(
        `/Account/GetByGameType/${gameType}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getPublished(): Promise<ApiResponse<IAccount[]>> {
    try {
      const response = await apiService.get<IAccount[]>("/Account/GetPublished");
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const accountService = AccountService.instance;
export default accountService;
