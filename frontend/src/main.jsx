import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom" 
import "@fontsource/poppins/300.css"; // light
import "@fontsource/poppins/400.css"; // regular
import "@fontsource/poppins/500.css"; // medium
import "@fontsource/poppins/600.css"; // semibold
import "@fontsource/poppins/700.css"; // bold





createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </StrictMode>,
)
