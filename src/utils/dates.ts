export const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateStr(dateStr: string): string {
  return formatDate(new Date(dateStr));
}

export function getFirstOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getTh(d: number) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
  }
  return 'th';
}

export function formatDayth(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const th = getTh(day);
  return `${day}${th}`;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime()-a.getTime())/(1000*60*60*24))
}