let url = ""
if (__DEV__) {
  url = "http://192.168.0.12:3001"
} else {
  url = "https://customer-api.kaserafood.com/v0.9.20"
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
