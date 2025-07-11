import './App.css'
import MyMenu from '../components/MyMenu.tsx'
import '@ant-design/v5-patch-for-react-19'
import { Route, Routes } from 'react-router'
import Calc from './Calc.tsx'
import Avatar from './Avatar.tsx'
// import { useState } from 'react'
import { ThemeContext } from '../context/ThemeContext.ts'
import { ConfigProvider, theme } from 'antd'
import useLocalStorage from '../hooks/useLocalStorage.tsx'
import { useEffect } from 'react'

function App() {
   const [darkTheme, setDarkTheme] = useLocalStorage('dark', false)

   const toggleTheme = () => {
      setDarkTheme(prev => !prev)
   }

   useEffect(() => {
      if (darkTheme) document.documentElement.classList.add('dark')
   })

   return (
      <div className="app">
         <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
            <ConfigProvider theme={{ algorithm: darkTheme ? theme.darkAlgorithm : undefined }}>
               <MyMenu />
               <Routes>
                  <Route path="/calc" element={<Calc />} />
                  <Route path="/avatar" element={<Avatar />} />
               </Routes>
            </ConfigProvider>
         </ThemeContext.Provider>
      </div>
   )
}

export default App
