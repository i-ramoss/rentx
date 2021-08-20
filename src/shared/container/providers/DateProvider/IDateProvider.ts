interface IDateProvider {
  compareInHours(star_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
}

export { IDateProvider };
