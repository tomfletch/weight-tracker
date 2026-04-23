export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function parseISODate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number);

  if (
    parts.length === 3 &&
    Number.isInteger(parts[0]) &&
    Number.isInteger(parts[1]) &&
    Number.isInteger(parts[2])
  ) {
    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);

    // Verify the date is valid by checking if the components match
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error(`Invalid date string: ${dateStr}`);
    }

    return date;
  }

  throw new Error(`Invalid date string: ${dateStr}`);
}

export function formatDateStr(dateStr: string): string {
  return formatDate(parseISODate(dateStr));
}

export function getFirstOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getTh(d: number) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDayth(dateStr: string) {
  const date = parseISODate(dateStr);
  const day = date.getDate();
  const th = getTh(day);
  return `${day}${th}`;
}

function zeroPad(value: number, length: number) {
  return String(value).padStart(length, '0');
}

export function toISODate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = zeroPad(date.getMonth() + 1, 2);
  const dd = zeroPad(date.getDate(), 2);

  return `${yyyy}-${mm}-${dd}`;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
