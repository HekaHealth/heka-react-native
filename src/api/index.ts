import axios from 'axios';
import { BaseURL } from '../constants';

export const api = axios.create({
  baseURL: BaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
