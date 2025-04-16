import s from './MyMenu.module.css'
import { NavLink } from 'react-router'

function MyMenu() {
   const items = [
      { label: 'Black Screen', key: 'bs' },
      { label: 'Calculator', key: 'calc' },
      { label: 'Avatar', key: 'avatar' },
   ]

   return (
      <div>
         <ul className={s.menu}>
            { items.map(item =>
               <li><NavLink to={item.key}>{item.label}</NavLink></li>)
            }
         </ul>
      </div>
   )
}

export default MyMenu
