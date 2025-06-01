import { useEffect, useRef, useState } from 'react'
import { Checkbox, CheckboxChangeEvent, ConfigProvider, notification, theme } from 'antd'
import { getReadableTime, toggleFullscreen } from '../util.ts'

export default function BlackScreen() {
   // State to manage the visibility of the element
   const [isVisible, setIsVisible] = useState(false)
   const notisRef = useRef(false)
   const [clockChecked, setClockChecked] = useState(false)
   const settingsRef = useRef({
      clock: false,
      showSeconds: false,
   })
   const backgroundRef = useRef<HTMLDivElement>(null)
   const [secondsChecked, setSecondsChecked] = useState(false)
   const [clockTime, setClockTime] = useState(getReadableTime())
   const [api, contextHolder] = notification.useNotification()

   // Variable to hold the timer ID
   let idleTimer: number | null = null

   function changeChecked(e: CheckboxChangeEvent, item = 'clock' as keyof typeof settingsRef.current) {
      console.log(e)
      setClockChecked(e.target.checked)
      settingsRef.current[item] = e.target.checked
      openNotification()
      // openNotification({ ...settingsRef.current, [item]: e.target.checked })
   }

   const openNotification = (settings = settingsRef.current) => {
      console.log('open', settings)
      api.open({
         message: `Settings`,
         key: 'notificationKey',
         description: (
            <div>
               <Checkbox onChange={(e) => { changeChecked(e) }} checked={settings.clock}>Clock</Checkbox>
               {settings.clock && <Checkbox onChange={(e) => {setSecondsChecked(e.target.checked); settingsRef.current.showSeconds = e.target.checked; openNotification();
               }} checked={settings.showSeconds}>Show Seconds in Clock</Checkbox>}
            </div>
         ),
         onClose: () => { notisRef.current = false },
         duration: 1.5,
         placement: 'top',
      })
   }

   const handleMouseMove = (e: MouseEvent) => {
      // When the mouse moves, show the element
      setIsVisible(true)
      // Clear the existing idle timer
      if (idleTimer) {
         clearTimeout(idleTimer)
      }
      // Set a new idle timer for 3 seconds
      idleTimer = setTimeout(() => {
         setIsVisible(false)
      }, 1000)

      const mouseY = e.clientY

      if (mouseY < 30 && !notisRef.current) {
         openNotification()
         notisRef.current = true
      }
   }

   useEffect(() => {
      // Add the mousemove event listener when the component mounts
      window.addEventListener('mousemove', handleMouseMove)
      backgroundRef.current?.addEventListener('dblclick', toggleFullscreen)
      setInterval(() => {
         setClockTime(getReadableTime())
      }, 1000)
      // Clean up the event listener when the component unmounts
      return () => {
         window.removeEventListener('mousemove', handleMouseMove)
         if (idleTimer) {
            clearTimeout(idleTimer)
         }
      }

   }, [])

   return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
         {contextHolder}
         <div className={'black-screen ' + (isVisible ? '' : 'cursor-none')} ref={backgroundRef}>
            {clockChecked && <div className="clock">{secondsChecked ? clockTime : clockTime.substring(0, clockTime.length - 3)}</div>}
            {isVisible &&
                <svg onClick={toggleFullscreen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z"/>
                </svg>
            }
         </div>
      </ConfigProvider>
   )
}