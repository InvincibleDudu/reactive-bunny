import { useEffect, useState } from 'react'
import * as React from 'react'

function getPersisted (key: string, init: unknown) {
   const item = localStorage.getItem(key)
   return item ? JSON.parse(item) : init
}

export default function useLocalStorage<T> (key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
   const [val, setVal] = useState<T>(() => getPersisted(key, initialValue))

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(val))
   }, [key, val])

   return [val, setVal]
}