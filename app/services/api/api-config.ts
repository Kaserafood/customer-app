let url = ""
if (__DEV__) {
  url = "https://kasera-customer-api-test.azurewebsites.net"
  url = "http://54.165.178.254:3002"
} else {
  url = "https://customer-api.kaserafood.com"
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
