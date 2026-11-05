import type {DataClient} from './ports';
export const demo=import.meta.env.VITE_DATA_MODE!=='live';
export const client:DataClient=demo?(await import('./mock')).mock:(await import('./supabase')).live;
