import Config from "react-native-config"

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
  url: "http://192.168.0.2:3000" || Config.API_URL,
  timeout: 50000,
}
