import { getI18nText } from "../../utils/translate"

export const useModalRequest = () => {
  const calendarText = {
    monthNames: [
      getI18nText("calendar.months.january"),
      getI18nText("calendar.months.february"),
      getI18nText("calendar.months.march"),
      getI18nText("calendar.months.april"),
      getI18nText("calendar.months.may"),
      getI18nText("calendar.months.june"),
      getI18nText("calendar.months.july"),
      getI18nText("calendar.months.august"),
      getI18nText("calendar.months.september"),
      getI18nText("calendar.months.october"),
      getI18nText("calendar.months.november"),
      getI18nText("calendar.months.december"),
    ],
    monthNamesShort: [
      getI18nText("calendar.monthsShort.jan"),
      getI18nText("calendar.monthsShort.feb"),
      getI18nText("calendar.monthsShort.mar"),
      getI18nText("calendar.monthsShort.apr"),
      getI18nText("calendar.monthsShort.may"),
      getI18nText("calendar.monthsShort.jun"),
      getI18nText("calendar.monthsShort.jul"),
      getI18nText("calendar.monthsShort.aug"),
      getI18nText("calendar.monthsShort.sep"),
      getI18nText("calendar.monthsShort.oct"),
      getI18nText("calendar.monthsShort.nov"),
      getI18nText("calendar.monthsShort.dec"),
    ],
    dayNames: [
      getI18nText("calendar.days.sunday"),
      getI18nText("calendar.days.monday"),
      getI18nText("calendar.days.tuesday"),
      getI18nText("calendar.days.wednesday"),
      getI18nText("calendar.days.thursday"),
      getI18nText("calendar.days.friday"),
      getI18nText("calendar.days.saturday"),
    ],
    dayNamesShort: [
      getI18nText("calendar.daysShort.sun"),
      getI18nText("calendar.daysShort.mon"),
      getI18nText("calendar.daysShort.tue"),
      getI18nText("calendar.daysShort.wed"),
      getI18nText("calendar.daysShort.thu"),
      getI18nText("calendar.daysShort.fri"),
      getI18nText("calendar.daysShort.sat"),
    ],
    today: getI18nText("calendar.today"),
  }

  return {
    calendarText,
  }
}
