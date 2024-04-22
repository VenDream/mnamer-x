import { Response } from '@/types';
import { clsx, type ClassValue } from 'clsx';
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
