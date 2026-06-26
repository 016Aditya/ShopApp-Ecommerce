/**
 * api/index.js — barrel export
 *
 * Consumers import from '@/api' instead of deep paths.
 *
 * Examples:
 *   import apiClient from '@/api';                    // Axios instance
 *   import { CART, PRODUCTS } from '@/api/endpoints'; // URL builders
 *   import { attachInterceptors } from '@/api/interceptors';
 */
export { default } from './axios';
export { attachInterceptors } from './interceptors';
export * as ENDPOINTS from './endpoints';
