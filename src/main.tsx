import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-500.css';
import '@fontsource/playfair-display/latin-600.css';
import './styles.css';
import {Providers} from './app/providers';
import {Router} from './app/router';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Providers><Router/></Providers></React.StrictMode>);
