import date               from 'date-and-time';
import {
  format as formatDate,
  isWeekend,
}                         from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const compensateDateWithHours = (date) => {
  if (date?.indexOf(' ') === -1) {
    return (date + ' 00:00:00');
  }

  return date;
};

export const datesForExtending = (
  fromDateString, numDays = 5, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  try {
    let validDate = toDate(fromDateString, pattern);
    const friday = 5;
    const saturday = 6;
    const addDays = (day) => {
      return day === friday ? 3 : day === saturday ? 2 : 1;
    };
    const mapVia = () => {
      return validDate = date.addDays(validDate, addDays(validDate.getDay()));
    };
    const dates = new Array(numDays).fill(null).map(mapVia);
    dates.unshift(new Date(fromDateString));

    return dates;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const toDate = (dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date.isValid(dateStr, pattern)) {
    return;
  }

  return new Date(dateStr);
};

export const daysBetween = (dateStringA, dateStringB) => {
  const tB = toDate(dateStringB)?.getTime();
  const tA = toDate(dateStringA)?.getTime();

  if (tB <= tA) {
    return 0;
  }

  let days = Math.ceil((tB - tA) / (1000 * 3600 * 24));
  let nDays = 0;
  let nD = toDate(dateStringA);
  if (nD) {
    for (let i = 0; i < days; i++) {
      nD = date.addDays(nD, 1);
      if (isWeekend(nD)) {
        nDays += 1;
      }
    }
  }

  return days - nDays - 1;
};

export function formatUtcToSpecificTZ(utcDatetime, timeZone = 'Europe/Berlin', formatStr = 'dd.MM.yyyy HH:mm:ss') {
  if(!utcDatetime) {
    return '';
  }
  const utcDate = new Date(utcDatetime.replace(' ', 'T').replace('Z', '') + 'Z');
  const zonedDate = utcToZonedTime(utcDate, timeZone);
  const formattedDate = formatDate(zonedDate, formatStr, { timeZone: timeZone });

  return formattedDate;
}
