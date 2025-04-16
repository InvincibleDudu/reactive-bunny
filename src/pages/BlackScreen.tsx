import { useEffect, useState } from 'react'

export default function BlackScreen() {
   // State to manage the visibility of the element
   const [isVisible, setIsVisible] = useState(false)
   // Variable to hold the timer ID
   let idleTimer: number | null = null

   const handleMouseMove = () => {
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
   }

   useEffect(() => {
      // Add the mousemove event listener when the component mounts
      window.addEventListener('mousemove', handleMouseMove)

      // Clean up the event listener when the component unmounts
      return () => {
         window.removeEventListener('mousemove', handleMouseMove)
         if (idleTimer) {
            clearTimeout(idleTimer)
         }
      }
   }, [])

   function toggleFullscreen() {
      const elem = document.documentElement

      if (!document.fullscreenElement) {
         elem.requestFullscreen().catch((err) => {
            alert(
               `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
            )
         })
      } else {
         document.exitFullscreen().then()
      }
   }


   return (
      <div className={'black-screen ' + (isVisible ? '' : 'cursor-none')}>
         {isVisible &&
             <svg onClick={toggleFullscreen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                 <path fill="currentColor" d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z" />
             </svg>
         }
      </div>
   )
}