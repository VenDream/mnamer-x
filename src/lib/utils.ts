import { Response } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

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
