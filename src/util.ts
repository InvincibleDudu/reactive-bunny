export function getReadableTime(time?: Date) {
   let m
   if (!time) m = new Date()
   else m = new Date(time)
   return (
      // m.getFullYear() + "/" +
      ('0' + (m.getMonth() + 1)).slice(-2) + '-' +
      ('0' + m.getDate()).slice(-2) + ' ' +
      ('0' + m.getHours()).slice(-2) + ':' +
      ('0' + m.getMinutes()).slice(-2) + ':' +
      ('0' + m.getSeconds()).slice(-2))
}

export function toggleFullscreen() {
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