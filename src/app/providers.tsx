import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {QueryClient,QueryClientProvider,useQueryClient} from '@tanstack/react-query';
import {client} from '../data';
import type {Profile} from '../data/ports';
const Auth=createContext<{profile:Profile|null;loading:boolean;reload:()=>Promise<void>}>({profile:null,loading:true,reload:async()=>{}});
export const useAuth=()=>useContext(Auth);
export function useOnline(){const [online,set]=useState(navigator.onLine);useEffect(()=>{const update=()=>set(navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);return online;}
export function useRealtime(){const qc=useQueryClient();useEffect(()=>{const off=client.orders.subscribe(()=>qc.invalidateQueries());const refresh=()=>qc.invalidateQueries();window.addEventListener('online',refresh);const timer=setInterval(refresh,10000);return()=>{off();clearInterval(timer);window.removeEventListener('online',refresh)}},[qc]);}
const queryClient=new QueryClient({defaultOptions:{queries:{retry:1,staleTime:15000,networkMode:'always'},mutations:{retry:false,networkMode:'always'}}});
function AuthProvider({children}:{children:ReactNode}){const [profile,set]=useState<Profile|null>(null),[loading,load]=useState(true);const reload=async()=>{try{set(await client.auth.session());}finally{load(false)}};useEffect(()=>{reload();return client.auth.onAuthChange(()=>{void reload()})},[]);return <Auth.Provider value={{profile,loading,reload}}>{children}</Auth.Provider>}
export function Providers({children}:{children:ReactNode}){return <QueryClientProvider client={queryClient}><AuthProvider>{children}</AuthProvider></QueryClientProvider>}
