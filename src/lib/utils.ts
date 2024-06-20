import { Response } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { DateRange } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildSuccessResponse(data: Record<string, any>) {
  const response: Response = {
    code: 0,
    data,
    errormsg: null,
  };
  return response;
}

export function buildErrorResponse(code: number, errormsg: string) {
  const response: Response = {
    code,
    data: null,
    errormsg,
  };
  return response;
}

export function zeroPad(num: number, places = 2) {
  return String(num).padStart(places, '0');
}

export function copyText(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export function getCurrentDatetime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function pick<T = Record<string, any>>(
  obj: Record<string, any>,
  keys: string[]
) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {} as T);
}

export function exclude<T = Record<string, any>>(
  obj: Record<string, any>,
  keys: string[]
) {
  return pick(
    obj,
    Object.keys(obj).filter(k => !keys.includes(k))
  ) as T;
}

export function stripJsonCodeBlockMarkup(text: string) {
  return text.replace('```json\n', '').replace('\n```', '');
}

export function getDateTimeDiff(start: Date | string, end: Date | string) {
  const dayDiff = differenceInDays(end, start);
  const hourDiff = differenceInHours(end, start);
  const minDiff = differenceInMinutes(end, start);
  const secDiff = differenceInSeconds(end, start);

  if (dayDiff > 0) {
    return format(start, 'MM-dd HH:mm');
  }
  if (hourDiff > 0) {
    const unit = hourDiff === 1 ? 'hr' : 'hrs';
    return `${hourDiff} ${unit} ago`;
  }
  if (minDiff > 0) {
    const unit = minDiff === 1 ? 'min' : 'mins';
    return `${minDiff} ${unit} ago`;
  }
  if (secDiff > 0) {
    const unit = secDiff === 1 ? 'sec' : 'secs';
    return `${secDiff} ${unit} ago`;
  }
  return '';
}

export function isDateBetween(date: Date | string, range: DateRange) {
  if (!range) return true;
  if (range.from) {
    if (range.to) {
      return dayjs(date).isBetween(range.from, range.to, 'day', '[]');
    }
    return dayjs(date).isSameOrAfter(range.from, 'day');
  }
  return true;
}

export function toHumanReadableSize(size: number) {
  const gb = Math.pow(1024, 3);
  const mb = Math.pow(1024, 2);
  const kb = Math.pow(1024, 1);

  if (size >= gb) {
    return `${(size / gb).toFixed(2)} GB`;
  }
  if (size >= mb) {
    return `${(size / mb).toFixed(2)} MB`;
  }
  if (size >= kb) {
    return `${(size / kb).toFixed(2)} KB`;
  }

  return `${size} B`;
}
