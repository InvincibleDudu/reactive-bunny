import { useCallback, useEffect, useRef, useState } from 'react'
import { Checkbox, CheckboxChangeEvent, ConfigProvider, notification, Slider, theme } from 'antd'
import { getReadableTime, toggleFullscreen } from '../util.ts'
import MyMenu from '../components/MyMenu.tsx'

const CLOCK_MOVE_INTERVAL_MS = 3 * 60 * 1000
const CLOCK_VIEWPORT_PADDING_PX = 16
const DEFAULT_CLOCK_OPACITY = 0.5
type BooleanSettingKey = 'clock' | 'showSeconds' | 'moveClock'

function randomClockTopPx(containerHeight: number, clockHeight: number) {
   const minTop = CLOCK_VIEWPORT_PADDING_PX
   const maxTop = containerHeight / 2 - clockHeight - CLOCK_VIEWPORT_PADDING_PX
   if (maxTop <= minTop) return minTop
   return minTop + Math.random() * (maxTop - minTop)
}

function centeredClockTopPx(containerHeight: number, clockHeight: number) {
   const centeredTop = containerHeight / 4 - clockHeight / 2
   const minTop = CLOCK_VIEWPORT_PADDING_PX
   const maxTop = containerHeight / 2 - clockHeight - CLOCK_VIEWPORT_PADDING_PX
   return Math.min(Math.max(centeredTop, minTop), maxTop)
}

export default function BlackScreen() {
   // State to manage the visibility of the element
   const [isVisible, setIsVisible] = useState(false)
   const notisRef = useRef(false)
   const [clockChecked, setClockChecked] = useState(false)
   const settingsRef = useRef({
      clock: false,
      showSeconds: false,
      moveClock: false,
      clockOpacity: DEFAULT_CLOCK_OPACITY,
   })
   const backgroundRef = useRef<HTMLDivElement>(null)
   const clockRef = useRef<HTMLDivElement>(null)
   const [secondsChecked, setSecondsChecked] = useState(false)
   const [moveClockChecked, setMoveClockChecked] = useState(false)
   const [clockTime, setClockTime] = useState(getReadableTime())
   const [clockTopPx, setClockTopPx] = useState(CLOCK_VIEWPORT_PADDING_PX)
   const [clockOpacity, setClockOpacity] = useState(DEFAULT_CLOCK_OPACITY)
   const [api, contextHolder] = notification.useNotification()
   const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
   const openNotificationRef = useRef<(settings?: typeof settingsRef.current) => void>(() => {})

   function changeChecked(e: CheckboxChangeEvent, item: BooleanSettingKey = 'clock') {
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
            <div className="black-screen-settings">
               <MyMenu noThemeToggle />
               <Checkbox onChange={(e) => { changeChecked(e) }} checked={settings.clock}>Clock</Checkbox>
               <Checkbox
                  disabled={!settings.clock}
                  onChange={(e) => {setSecondsChecked(e.target.checked); settingsRef.current.showSeconds = e.target.checked; openNotification();
                  }}
                  checked={settings.showSeconds}
               >
                  Show Seconds in Clock
               </Checkbox>
               <Checkbox
                  disabled={!settings.clock}
                  onChange={(e) => {setMoveClockChecked(e.target.checked); settingsRef.current.moveClock = e.target.checked; openNotification();
                  }}
                  checked={settings.moveClock}
               >
                  Moving Clock
               </Checkbox>
               <div className="clock-opacity-setting">
                  <span>Clock Brightness</span>
                  <Slider
                     disabled={!settings.clock}
                     defaultValue={settings.clockOpacity * 100}
                     min={0}
                     max={100}
                     tooltip={{ formatter: (value) => `${value}%` }}
                     onChange={(value) => {
                        const nextOpacity = value / 100
                        setClockOpacity(nextOpacity)
                        settingsRef.current.clockOpacity = nextOpacity
                     }}
                  />
               </div>
            </div>
         ),
         onClose: () => { notisRef.current = false },
         duration: 1.5,
         placement: 'bottom',
      })
   }
   openNotificationRef.current = openNotification

   const handleMouseMove = useCallback((e: MouseEvent) => {
      setIsVisible(true)
      if (idleTimerRef.current) {
         clearTimeout(idleTimerRef.current)
      }
      idleTimerRef.current = setTimeout(() => {
         setIsVisible(false)
      }, 1000)

      if (window.innerHeight - e.clientY < 30 && !notisRef.current) {
         openNotificationRef.current()
         notisRef.current = true
      }
   }, [])

   const repositionClock = useCallback(() => {
      const container = backgroundRef.current
      const clock = clockRef.current
      if (!container || !clock) return

      const topPx = moveClockChecked
         ? randomClockTopPx(container.clientHeight, clock.offsetHeight)
         : centeredClockTopPx(container.clientHeight, clock.offsetHeight)
      setClockTopPx(topPx)
   }, [moveClockChecked])

   useEffect(() => {
      if (!clockChecked) return

      const frame = requestAnimationFrame(repositionClock)
      const moveInterval = moveClockChecked
         ? setInterval(repositionClock, CLOCK_MOVE_INTERVAL_MS)
         : undefined
      window.addEventListener('resize', repositionClock)

      return () => {
         cancelAnimationFrame(frame)
         if (moveInterval) clearInterval(moveInterval)
         window.removeEventListener('resize', repositionClock)
      }
   }, [clockChecked, secondsChecked, moveClockChecked, repositionClock])

   useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove)
      const background = backgroundRef.current
      background?.addEventListener('dblclick', toggleFullscreen)
      const clockInterval = setInterval(() => {
         setClockTime(getReadableTime())
      }, 1000)

      return () => {
         window.removeEventListener('mousemove', handleMouseMove)
         background?.removeEventListener('dblclick', toggleFullscreen)
         clearInterval(clockInterval)
         if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current)
         }
      }
   }, [handleMouseMove])

   return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
         {contextHolder}
         <div className={'black-screen ' + (isVisible ? '' : 'cursor-none')} ref={backgroundRef}>
            {clockChecked && (
               <div
                  ref={clockRef}
                  className="clock"
                  style={{ color: `rgba(255, 255, 255, ${clockOpacity})`, top: `${clockTopPx}px` }}
               >
                  {secondsChecked ? clockTime : clockTime.substring(0, clockTime.length - 3)}
               </div>
            )}
            {isVisible &&
                <svg onClick={toggleFullscreen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z"/>
                </svg>
            }
         </div>
      </ConfigProvider>
   )
}
