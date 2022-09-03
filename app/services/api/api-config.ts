// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")
// Or just specify it directly like this:

let API_URL = ""
if (__DEV__) {
  API_URL = "http://192.168.0.9:3000"
  //API_URL = "https://kasera-customer-api-test.azurewebsites.net"
} else {
  API_URL = "https://kasera-customer-api.azurewebsites.net"
}
/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL,
  timeout: 50000,
}
