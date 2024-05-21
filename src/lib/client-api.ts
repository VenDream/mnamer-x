import { InputData } from '@/app/tasks/manual';
import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function rename(data: InputData, opts?: AxiosRequestConfig) {
  return instance.post('/api/naming', data, opts);
}
