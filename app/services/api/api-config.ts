let url = ""
if (__DEV__) {
  url = "https://kasera-customer-api-test.azurewebsites.net"
  url = "http://192.168.0.13:3001"
} else {
  url = "https://kasera-customer-api.azurewebsites.net"
}

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
  url,
  timeout: 50000,
}
