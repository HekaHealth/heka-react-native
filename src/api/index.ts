import axios from 'axios';
import { BaseURL } from '../constants';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const api = axios.create({
  baseURL: BaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
