/**
 *
 * @param timeZone timezone from the user
 * @returns  {string}
 */
export function getCurrentDate(timeZone: string): string {
  const date = new Date().toLocaleString("en-US", { timeZone: timeZone })
  return toFormatDateTime(new Date(date), "YYYY-MM-DD HH:mm:ss")
}

/**
 * @param date date to format
 * @param format format to use
 * @returns {string}
 */
type format = "YYYY-MM-DD" | "DD-MM-YYYY" | "DD/MM/YYYY" | "MM/DD/YYYY"
export function toFormatDate(date: Date, format: format): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("DD", day.toString())
}

/**
 * @param date date to format
 * @param format format to use
 * @returns {string}
 */
type formatDateTime =
  | "YYYY-MM-DD HH:mm:ss"
  | "DD-MM-YYYY HH:mm:ss"
  | "DD/MM/YYYY HH:mm:ss"
  | "MM/DD/YYYY HH:mm:ss"
export function toFormatDateTime(date: Date, format: formatDateTime) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("DD", day.toString())
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"))
}
