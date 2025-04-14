import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import BlackScreen from './pages/BlackScreen.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
        <Routes>
           <Route path="/" element={<App />} />
           <Route path="bs" element={<BlackScreen />} />
        </Routes>
     </BrowserRouter>
  </StrictMode>,
)
