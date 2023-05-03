export class DateUtil {
  public static formatDate(newDate: Date) {
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  }
}
