export default function daysBetweenDates(date1: string, date2: string): number {
  const oneDay = 24 * 60 * 60 * 1000; // number of milliseconds in one day
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  console.log(oneDay, firstDate.getTime(), secondDate.getTime());
  const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
  return diffDays;
}
