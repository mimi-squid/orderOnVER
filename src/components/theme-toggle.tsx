import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';
type Theme='light'|'dark';
function initialTheme():Theme {return document.documentElement.dataset.theme==='dark'?'dark':'light'}
export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>(initialTheme);
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;try{localStorage.setItem('orderon-theme',theme)}catch{}},[theme]);
 useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key==='orderon-theme'&&(event.newValue==='dark'||event.newValue==='light'))setTheme(event.newValue)};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[]);
 return <button className="theme-toggle" type="button" aria-label={theme==='light'?'Switch to dark theme':'Switch to light theme'} aria-pressed={theme==='dark'} title={theme==='light'?'Switch to dark theme':'Switch to light theme'} onClick={()=>setTheme(theme==='light'?'dark':'light')}><span key={theme} className="theme-toggle-icon">{theme==='light'?<Moon size={19}/>:<Sun size={19}/>}</span></button>
}
