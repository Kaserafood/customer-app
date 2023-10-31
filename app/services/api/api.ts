import { ApiResponse, ApisauceInstance, create } from "apisauce"

import { Address } from "../../models"
import { Order } from "../../models/order/order"
import { UserLogin, UserRegister } from "../../models/user-store"
import { Card } from "../../screens/checkout/modal-payment-card"
import { handleMessageProblem } from "../../utils/messages"

import { SetupIntent } from "../../screens/checkout/modal-payment-stripe"
import { loadString } from "../../utils/storage"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { getGeneralApiProblem } from "./api-problem"
import {
  AccountResponse,
  AddressResponse,
  BannerResponse,
  CardResponse,
  CategoryResponse,
  ChefResponse,
  CommonResponse,
  CountryResponse,
  CuponResponse,
  DatesPlansResponse,
  DayResponse,
  DishResponse,
  GeneralApiResponse,
  LunchesResponse,
  OrderDetailChef,
  OrderDetailResponse,
  OrderOverviewResponse,
  OrderPlanRequest,
  OrdersChef,
  OrdersChefParams,
  ReservationRequest,
  SetupIntentResponse,
  UserLoginResponse,
  ValueResponse,
} from "./api.types"

type requestType = "GET" | "POST" | "PUT" | "DELETE"
let countryId
let locale: string

export function setLocale(localeCode: string) {
  locale = localeCode
}

export function setCountryId(id: number) {
  countryId = id
}
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
        "Accept-Language": locale,
      },
    })

    // Add a request interceptor
    this.apisauce.axiosInstance.interceptors.request.use(
      async function (config) {
        if (!countryId) {
          countryId = await loadString("countryId")
        }

        if (!locale) {
          locale = await loadString("locale")
        }
        //  __DEV__ && console.log("Request: ", JSON.stringify(config, null, 2))
        config.headers["country-id"] = parseInt(countryId || -1)
        config.headers["Accept-Language"] = locale

        if (config.url === "/users/login") countryId = null
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
      const response: ApiResponse<any> = await this.apisauce[requestType.toLowerCase()](url, body)

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
      //   showMessageError()
      throw e
      // return { kind: "bad-data", data: [] }
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
    tokenPagination: string,
    latitude: number,
    longitude: number,
    categoryId?: number,
    isFavorite?: boolean,
  ): Promise<DishResponse> {
    return await this.request(
      {
        date,
        timeZone,
        userId,
        tokenPagination,
        latitude,
        longitude,
        categoryId,
        isFavorite,
      },
      "/dishes",
      "GET",
    )
  }

  /**
   *
   * @description Get dish by id
   */
  async getDish(dishId: number, latitude: number, longitude: number): Promise<DishResponse> {
    return await this.request({ latitude, longitude }, `/dishes/${dishId}`, "GET")
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
    latitude: number,
    longitude: number,
    categoryId?: number,
  ): Promise<ChefResponse> {
    return await this.request(
      { date, timeZone, latitude, longitude, categoryId },
      "/dishes/chefs",
      "GET",
    )
  }

  /**
   *
   * @description Search dishes by name or description
   */
  async getSearchDishes(
    search: string,
    date: string,
    timeZone: string,
    latitude: number,
    longitude: number,
  ): Promise<DishResponse> {
    return await this.request(
      {
        date,
        timeZone,
        search,
        latitude,
        longitude,
      },
      "/dishes/search",
      "GET",
    )
  }

  /**

  /**
   *
   * @description Get information from a specific user chef
   */
  async getInfoChef(chefId: number): Promise<ChefResponse> {
    return await this.request({}, `/users/chefs/${chefId}`, "GET")
  }

  /**
   *
   * @description Get dishes grouped by latest chef
   */
  async getDishesGroupedByLatestChef(
    date: string,
    timeZone: string,
    latitude: number,
    longitude: number,
  ): Promise<ChefResponse> {
    return await this.request(
      { date, timeZone, latitude, longitude },
      "/dishes/chefs-latest",
      "GET",
    )
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
  async register(userRegister: UserRegister): Promise<UserLoginResponse> {
    return await this.request(userRegister, "/users/register", "POST")
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
   * @description Get detail of coupon code
   */
  async getCoupon(couponCode: string, userId: number, timeZone: string): Promise<CuponResponse> {
    return await this.request({ userId, timeZone }, `/orders/coupon/${couponCode}`, "GET")
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
  async getPriceDelivery(addressId: number): Promise<CommonResponse> {
    return await this.request({ addressId }, `/deliveries/price`, "GET")
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
  async getCoverage(): Promise<CommonResponse> {
    return await this.request({}, `/deliveries/coverage`, "GET")
  }

  /**
   * @description Get coverage credits
   */
  async getCoverageCredits(): Promise<ValueResponse> {
    return await this.request({}, `/deliveries/coverage-credits`, "GET")
  }

  /**
   * @description Send report bug to admin
   */
  async reportBug(data: any): Promise<CommonResponse> {
    return await this.request(data, `/users/report-bug`, "POST")
  }

  /**
   * @description Get all banners
   */
  async getBanners(): Promise<BannerResponse> {
    return await this.request({}, `/banners`, "GET")
  }

  /**
   * @description Get Option in system
   */
  async getParam(name: string): Promise<CommonResponse> {
    return await this.request({}, `/params/${name}`, "GET")
  }

  /**
   * @description Get all card from user
   */
  async getPaymentMethodsQPayPro(userId: number): Promise<CardResponse> {
    return await this.request({}, `/users/cards/${userId}`, "GET")
  }

  /**
   * @description Update the card selected from user
   */
  async updateSelectedCard(
    userId: number,
    cardId: number | null | string,
  ): Promise<CommonResponse> {
    return await this.request({ cardId }, `/users/cards/${userId}`, "PUT")
  }

  /**
   * @description Add a card to user
   */
  async addPaymentMethodQPayPro(userId: number, card: Card): Promise<CommonResponse> {
    return await this.request(card, `/users/cards/${userId}`, "POST")
  }

  /**
   * @description Get all countries
   */
  async getCountries(): Promise<CountryResponse> {
    return await this.request({}, `/countries`, "GET")
  }

  /**
   * @description Get all payment methods from user
   */
  async getPaymentMethodsStripe(userId: number): Promise<CardResponse> {
    return await this.request({}, `/stripe/payment-methods/${userId}`, "GET")
  }

  /**
   * @description Add payment method in stripe
   */
  async addPaymentMethodStripe(userId: number, email: string, card: Card): Promise<CommonResponse> {
    return await this.request({ userId, email, ...card }, `/stripe/payment-methods/`, "POST")
  }

  /**
   * @description Get delivery time for chef
   */
  async getDeliveryTime(chefId: number, date: string): Promise<CountryResponse> {
    return await this.request({ chefId, date }, `/deliveries/delivery-time`, "GET")
  }

  /**
   * @description Create payment setup for Stripe
   */
  async createSetupIntent(
    userId: number,
    email: string,
    card: SetupIntent,
  ): Promise<SetupIntentResponse> {
    return await this.request({ userId, email, ...card }, `/stripe/payment-intent-setup/`, "POST")
  }

  /**
   * @description Get publishable key from Stripe
   */
  async getPublishableKey(): Promise<ValueResponse> {
    return await this.request({}, `/stripe/publishable-key`, "GET")
  }

  /**
   * @description Insert the name and stripe payment method id
   */
  async addPaymentMethodId(stripePaymentId: string, name: string): Promise<ValueResponse> {
    return await this.request({ stripePaymentId, name }, `/stripe/add-payment-method-id`, "POST")
  }

  /**
   * @description Get all lunches for plans by date
   */
  async getItemsPlan(date: string, type: string): Promise<LunchesResponse> {
    return await this.request({ date, type }, `/recipes`, "GET")
  }

  /**
   * @description Get dates for plans
   */
  async getDatesPlans(): Promise<DatesPlansResponse> {
    return await this.request({}, `/recipes/dates`, "GET")
  }

  /**
   * @description Insert the name and stripe payment method id
   */
  async createOrderPlan(orderPlan: OrderPlanRequest): Promise<ValueResponse> {
    return await this.request(orderPlan, `/plans`, "POST")
  }

  /**
   * @description Create a reservation for an existent plan
   */
  async createReservation(orderPlan: ReservationRequest): Promise<ValueResponse> {
    console.log("LOCALE", locale)
    return await this.request(orderPlan, `/plans/reservation`, "POST")
  }

  /**
   * @description Get the user account
   */
  async getAccount(userId: number, timeZone: string): Promise<AccountResponse> {
    return await this.request({ userId, timeZone }, `/users/account`, "GET")
  }

  /**
   * @description Get orders for chef
   */

  async getOrdersChef(params: OrdersChefParams): Promise<OrdersChef> {
    return await this.request({ ...params }, `/chefs/orders`, "GET")
  }

  /**
   * @description Get orders for chef
   */
  async getOrderChefById(orderId: number, timeZone: string): Promise<OrderDetailChef> {
    return await this.request({ timeZone }, `/chefs/orders/${orderId}`, "GET")
  }

  /**
   * @description Update order status
   */
  async updateOrderStatus(orderId: number, status: string): Promise<ValueResponse> {
    return await this.request({ status }, `/chefs/orders/${orderId}/status`, "PUT")
  }

  /**
   * @description Get plan config
   */
  async getPlanConfig(): Promise<ValueResponse> {
    return await this.request({}, `/plans/config`, "GET")
  }

  /**
   * @description Get plan config
   */
  async uploadInvoice(formData: any): Promise<ValueResponse> {
    return await this.request(formData, `/upload-file`, "POST")
  }
}
