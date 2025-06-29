import { ChangeEvent, useEffect, useState } from 'react'
import './Avatar.scss'

export default function Avatar () {
   const [svg, setSvg] = useState("")
   const [color, setColor] = useState("#ffffff")
   const [size, setSize] = useState(200)
   const [svgWidth, setSvgWidth] = useState(100)
   const [svgHeight, setSvgHeight] = useState(100)
   const [canvas, setCanvas] = useState(false)
   const [ratioLock, setRatioLock] = useState(false)
   const [ratio, setRatio] = useState(1)
   // const [scale, setScale] = useState(1)

   useEffect(() => {
      if (!svg) return
      setCanvas(true)
      const svgEle = document.querySelector('.avatar-svg svg')
      if (!svgEle) return
      const svgHtml = (svgEle.cloneNode(true) as HTMLElement).outerHTML
      const blob = new Blob([svgHtml], {type: 'image/svg+xml;charset=utf-8'})
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(blob)
      console.log('svgHTML')
      const image = new Image()
      image.onload = () => {
         const canvas = document.getElementById('canvas') as HTMLCanvasElement
         canvas.width = size
         canvas.height = size
         const context = canvas.getContext('2d')
         if (context) {
            context.fillStyle = color
            context.fillRect(0, 0, size, size)
            context.drawImage(image, (size - svgWidth) / 2, (size - svgHeight) / 2, svgWidth, svgHeight)
         }
      }
      image.src = blobURL
   }, [svg, color, size, svgWidth, svgHeight])

   function handleInput(event: ChangeEvent<HTMLInputElement>) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
         if (!e.target) return
         const text = (e.target.result) as string
         console.log(text)
         if (!text.includes('<svg') && !event.target.value.includes('.svg')) {
            alert('Not a valid SVG file')
            return
         }
         setSvg(text)
         const dims = getSvgDimensions(text)
         setSvgWidth(dims[0])
         setSvgHeight(dims[1])
         setRatio(dims[0] / dims[1])
         const longSideLength = Math.max(dims[0], dims[1])
         if (longSideLength > 200) setSize(longSideLength + longSideLength / 10)
         const d = document.querySelector(".avatar-svg svg") as SVGElement | null
         if (d) {
            d.style.width = svgWidth + "px"
            d.style.height = svgHeight + "px"
         }
      }
      if (event.target?.files?.[0]) reader.readAsText(event.target.files[0])
   }

   function handleSvgWidth(e: ChangeEvent<HTMLInputElement>) {
      setSvgWidth(+e.target.value)
      if (ratioLock) setSvgHeight(+e.target.value / ratio)
      const d = document.querySelector(".avatar-svg svg") as SVGElement | null
      if (d) d.style.width = e.target.value + "px"
   }

   function handleSvgHeight(e: ChangeEvent<HTMLInputElement>) {
      setSvgHeight(+e.target.value)
      const d = document.querySelector(".avatar-svg svg") as SVGElement | null
      if (d) d.style.height = e.target.value + "px"
   }

   function handleRatioLock (e: ChangeEvent<HTMLInputElement>) {
      setRatioLock(e.target.checked)
      setSvgHeight(svgWidth / ratio)
   }

   function download() {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement
      const url = canvas.toDataURL("image/png")
      const link = document.createElement('a')
      const file = document.querySelector('input[type="file"]') as HTMLInputElement
      if (!file.files) return
      link.download = `${file.files[0].name}-${size}px-${color}.png`
      link.href = url
      link.click()
   }

   function getSvgDimensions(svgString = svg): [number, number] {
      const viewBoxArr = svgString.match(/viewBox="([\d\s]+)"/)
      if (!viewBoxArr || viewBoxArr.length < 2) return [100, 100]
      const viewBoxValues = viewBoxArr[1].split(' ')
      return [+viewBoxValues[2], +viewBoxValues[3]]
   }

   return (
      <div className={'avatar'}>
         <main className={svg ? '' : 'grid-center'}>
            <label htmlFor="avatar">Choose an svg: </label>
            <input type="file" id="avatar" name="avatar" accept="image/svg+xml" onInput={handleInput}/>
            {svg &&
                <>
                    <span className="color-label">BG Color:</span>
                    <label htmlFor="color-picker" style={{background: color}}> &nbsp;&nbsp;&nbsp; </label>
                    <input type="color" id="color-picker" value={color} onChange={(e) => {setColor(e.target.value)}}/>
                    <div>
                        <label htmlFor="bg-size">Background Size:</label>
                        <input type="range" id="bg-size" max={2000} min={100} value={size}
                               onChange={(e) => setSize(parseInt(e.target.value))}/>
                        <ClickToInput value={size} onChange={(e) => setSize(+e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="lock-ratio">Lock SVG Aspect Ratio</label>
                        <input type="checkbox" id="lock-ratio" onChange={handleRatioLock} />
                    </div>
                    <div>
                        <label htmlFor="svg-width">Svg {ratioLock ? 'Size' : 'Width'}:</label>
                        <input type="range" id="svg-width" max={1500} min={50} onChange={handleSvgWidth} value={svgWidth}/>
                        <ClickToInput value={svgWidth} onChange={handleSvgWidth} />
                    </div>
                   {!ratioLock && <div>
                       <label htmlFor="svg-height">Svg Height:</label>
                       <input type="range" id="svg-height" max={1500} min={50} onChange={handleSvgHeight} value={svgHeight}/>
                       <ClickToInput value={svgHeight} onChange={handleSvgHeight} />
                   </div>}
                   {/*<button className="confirm" onClick={handleConfirm}>Confirm</button>*/}
                   {canvas && <button onClick={download}>Download</button>}
                   {/*<button onClick={() => setScale(scale - 0.25)}>Preview Scale - </button>*/}
                   {/*<button onClick={() => setScale(scale + 0.25)}>Preview Scale + </button>*/}
                </>
            }
            {/*{svg && <div className="label">HTML Preview (Inaccurate): </div>}*/}
            <div dangerouslySetInnerHTML={{__html: svg}} className={'svg avatar-svg'}
                 style={{background: color, width: size}}></div>
            {canvas &&
                <>
                    <div className="label">Preview: </div>
                    <canvas width={size} height={size} id="canvas" style={{background: color}}></canvas>
                </>
            }
         </main>
         <footer>
            <p>@InvincibleDudu</p>
         </footer>
      </div>
   )
}

function ClickToInput (props: { value: number | string, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
   const [isInput, setIsInput] = useState(false)

   if (isInput) return (
      <input type="number" value={props.value} onChange={props.onChange} onBlur={() => setIsInput(false)} />
   )
   return (
      <span className="click-span" onClick={() => setIsInput(true)}>{props.value}</span>
   )
}
