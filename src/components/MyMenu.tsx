import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import s from './MyMenu.module.css'
import { NavLink, useLocation } from 'react-router'
import { Button } from 'antd'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext.ts'

function MyMenu({ noThemeToggle = false }: { noThemeToggle?: boolean }) {
   const themeContext  = useContext(ThemeContext)
   const location = useLocation()
   const currentPath = location.pathname
   const items = [
      { label: 'Home', key: '/' },
      { label: 'Black Screen', key: '/bs' },
      { label: 'Calculator', key: '/calc' },
      { label: 'Avatar', key: '/avatar' },
   ]

   return (
      <div className={s.wrapper + (currentPath === '/' ? ' ' + s.middle : '')}>
         <ul className={s.menu}>
            { items.map(item =>
               <li><NavLink to={item.key}>{item.label}</NavLink></li>)
            }
            {!noThemeToggle && <li>
                <Button className={s['menu-icon']} icon={themeContext?.darkTheme ? <SunOutlined /> : <MoonOutlined />} onClick={() => { themeContext?.toggleTheme() }} type="link" />
            </li>}
         </ul>
      </div>
   )
}

export default MyMenu
