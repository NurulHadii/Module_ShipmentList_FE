import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_BOOXAPP_API_URL;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static  setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
      ApiService.vueInstance.axios.defaults.headers.common["Tenant"] = JwtService.getTenant();
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async query(resource: string, params: any): Promise<AxiosResponse> {
    return (await ApiService.vueInstance.axios.get(resource, params));
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static async get (
    resource: string,
    useHeader? : Boolean
  ): Promise<AxiosResponse> {
    if (useHeader === true) this.setHeader();
    return (await ApiService.vueInstance.axios.get(`${resource}`)).data;
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async post(resource: string, params: any): Promise<AxiosResponse> {
    return (await ApiService.vueInstance.axios.post(`${resource}`, params)).data;
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return (await ApiService.vueInstance.axios.put(`${resource}/${slug}`, params)).data;
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async put(resource: string, params: any): Promise<AxiosResponse> {
    return (await ApiService.vueInstance.axios.put(`${resource}`, params)).data;
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static async delete(resource: string): Promise<AxiosResponse> {
    return (await ApiService.vueInstance.axios.delete(resource)).data;
  }
}

export default ApiService;
