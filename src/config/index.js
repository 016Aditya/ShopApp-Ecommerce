/**
 * config/index.js — barrel export
 *
 * Import from '@/config' instead of deep paths.
 *
 * Examples:
 *   import { env }   from '@/config';
 *   import { FLAGS } from '@/config';
 *   import { ROUTES, ORDER_STATUS, CURRENCY } from '@/config';
 */
export { env }          from './env';
export { FLAGS }        from './featureFlags';
export * from './constants';
