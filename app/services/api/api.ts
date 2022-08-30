import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { Address } from "../../models"
import { Order } from "../../models/order/order"
import { UserLogin } from "../../models/user-store"
import { handleMessageProblem, showMessageError } from "../../utils/messages"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { getGeneralApiProblem } from "./api-problem"
import {
  AddressResponse,
  CategoryResponse,
  ChefResponse,
  CommonResponse,
  CoverageResponse,
  DayResponse,
  DishResponse,
  GeneralApiResponse,
  OrderDetailResponse,
  OrderOverviewResponse,
  UserLoginResponse,
} from "./api.types"

type requestType = "GET" | "POST" | "PUT" | "DELETE"
/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    if (!this.apisauce) this.setup()
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Accept-Language": "es",
      },
    })

    // Add a request interceptor
    this.apisauce.axiosInstance.interceptors.request.use(
      function (config) {
        //  __DEV__ && console.log("Request: ", JSON.stringify(config, null, 2))
        return config
      },
      function (error) {
        __DEV__ && console.log("Request error: ", JSON.stringify(error, null, 2))
        return Promise.reject(error)
      },
    )

    // Add a response interceptor
    this.apisauce.axiosInstance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger

        //  __DEV__ && console.log("Response : " + JSON.stringify(response, null, 2))
        return response
      },
      function (error) {
        __DEV__ && console.log(`Response error: ${JSON.stringify(error, null, 2)}`)

        // Any status codes that falls outside the range of 2xx cause this function to trigger

        return Promise.reject(error)
      },
    )
  }

  async request(body: any, url: string, requestType: requestType): Promise<GeneralApiResponse> {
    try {
      const response: ApiResponse<any> = await this.apisauce[requestType.toLowerCase()](url, {
        ...body,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        handleMessageProblem(problem)
        return null
      }

      let data: any
      if (Array.isArray(response.data)) {
        data = [...response.data]
      } else {
        data = { ...response.data }
      }

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.log(`Error : ${e.message}`)
      showMessageError()
      return { kind: "bad-data", data: [] }
    }
  }

  /**
   *
   * @description Get all dishes
   */
  async getAllDishes(
    date: string,
    timeZone: string,
    userId: number,
    categoryId?: number,
  ): Promise<DishResponse> {
    return await this.request(
      {
        date,
        timeZone,
        userId,
        categoryId,
      },
      "/dishes",
      "GET",
    )
  }

  /**
   *
   * @description Get dishes favorites by Kasera
   */
  async getFavoritesDishes(date: string, timeZone: string): Promise<DishResponse> {
    return await this.request(
      {
        date,
        timeZone,
      },
      "/dishes/favorites",
      "GET",
    )
  }

  /**
   *
   * @description Get dishes from specific chef
   */
  async getDishesByChef(chefId: number): Promise<DishResponse> {
    return await this.request({}, `/dishes/chefs/${chefId}`, "GET")
  }

  /**
   *
   * @description Get dishes grouped by chef
   */
  async getDishesGroupedByChef(
    date: string,
    timeZone: string,
    categoryId?: number,
  ): Promise<ChefResponse> {
    return await this.request({ date, timeZone, categoryId }, "/dishes/chefs", "GET")
  }

  /**
   *
   * @description Get dishes grouped by latest chef
   */
  async getDishesGroupedByLatestChef(date: string, timeZone: string): Promise<ChefResponse> {
    return await this.request({ date, timeZone }, "/dishes/chefs-latest", "GET")
  }

  /**
   *
   * @description Login user authentication
   */
  async login(userLogin: UserLogin): Promise<UserLoginResponse> {
    return await this.request(userLogin, "/users/login", "POST")
  }

  /**
   *
   * @description Register new user
   */
  async register(userLogin: UserLogin): Promise<UserLoginResponse> {
    return await this.request(userLogin, "/users/register", "POST")
  }

  /**
   *
   * @description Get all categories of food
   */
  async getAllCategories(): Promise<CategoryResponse> {
    return await this.request({}, "/categories", "GET")
  }

  /**
   *
   * @description Get category seasonal
   */
  async getCategorySeasonal(): Promise<CategoryResponse> {
    return await this.request({}, "/categories/seasonal", "GET")
  }

  /**
   *
   * @description Get days to delivery
   */
  async getDaysDelivery(timeZone: string): Promise<DayResponse> {
    return await this.request({ timeZone }, "/deliveries/days", "GET")
  }

  /**
   *
   * @description Get days to delivery available for a specific chef
   */
  async getDaysByChefDelivery(timeZone: string, chefId: number): Promise<DayResponse> {
    return await this.request({ timeZone }, `/deliveries/days/${chefId}`, "GET")
  }

  /**
   *
   * @description Create an address
   */
  async addAddress(address: Address): Promise<CommonResponse> {
    return await this.request(address, "/addresses", "POST")
  }

  /**
   *
   * @description Get address from users
   */
  async getAddresses(userId: number): Promise<AddressResponse> {
    return await this.request({}, `/addresses/user/${userId}`, "GET")
  }

  /**
   *
   * @description Update the address default from the user
   */
  async updateAddressId(userId: number, addressId: number): Promise<UserLoginResponse> {
    return await this.request({ addressId: addressId }, `/users/${userId}/addressId`, "PUT")
  }

  /**
   *
   * @description Create an order
   */
  async addOrder(order: Order): Promise<CommonResponse> {
    return await this.request(order, "/orders", "POST")
  }

  /**
   *
   * @description Get orders overview from user
   */
  async getOrdersOverview(userId: number): Promise<OrderOverviewResponse> {
    return await this.request({}, `/orders/user/${userId}`, "GET")
  }

  /**
   *
   * @description Get detail of order
   */
  async getOrderDetail(orderId: number): Promise<OrderDetailResponse> {
    return await this.request({}, `/orders/${orderId}`, "GET")
  }

  /**
   *
   * @description Send a email whith the token to user to recover password
   */
  async sendEmailRecoverPassword(email: string): Promise<CommonResponse> {
    return await this.request({ email }, `/users/email-recover-password`, "POST")
  }

  /**
   *
   * @description Send the token to valid if is valid to change the password
   */
  async validTokenRecoverPassword(token: string, email: string): Promise<CommonResponse> {
    return await this.request({ token, email }, `/users/token`, "POST")
  }

  /**
   *
   * @description Change the password form the user
   */
  async changePassword(email: string, password: string): Promise<CommonResponse> {
    return await this.request({ email, password }, `/users/change-password`, "POST")
  }

  /**
   *
   * @description Request a dish when is not found
   */
  async requestDish(
    dishName: string,
    dishPeople: number,
    dishDate: string,
    userEmail: string,
    userId: number,
  ): Promise<CommonResponse> {
    return await this.request(
      { dishName, dishPeople, dishDate, userEmail, userId },
      `/dishes/request`,
      "POST",
    )
  }

  /**
   * @description Get price to delivery
   */
  async getPriceDelivery(): Promise<CommonResponse> {
    return await this.request({}, `/orders/price-delivery`, "GET")
  }

  /**
   * @description Remove account from user
   */
  async removeAccount(userId: number): Promise<CommonResponse> {
    return await this.request({}, `/users/account/${userId}`, "DELETE")
  }

  /**
   * @description Get all coordiantes of the coverage.
   */
  async getCoverage(): Promise<CoverageResponse> {
    return await this.request({}, `/deliveries/coverage`, "GET")
  }
}
