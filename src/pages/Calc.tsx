import { Button, InputNumber, Table } from 'antd'
import { useState } from 'react'
import { toFixedNumber } from '../util.ts'

type DisplayData = { horizontal: number, vertical: number, size: number }

export default function Calc () {
   const [rof, setRof] = useState(600)
   const [btk, setBtk] = useState(3)
   const [vertical, setVertical] = useState(toFixedNumber(window.screen.height * window.devicePixelRatio, 2))
   const [horizontal, setHorizontal] = useState(toFixedNumber(window.screen.width * window.devicePixelRatio, 2))
   const [size, setSize] = useState(6)
   const [list, setList] = useState<Array<DisplayData>>([])

   const { Column } = Table

   function getAspectRatio(width = horizontal, height = vertical) {
      function gcd(a: number, b: number): number {
         return b === 0 ? a : gcd(b, a % b)
      }

      const divisor = gcd(width, height)
      const ratioWidth = width / divisor
      const ratioHeight = height / divisor

      return `${ratioWidth}:${ratioHeight}`
   }

   function getFixedAspectRatio(width = horizontal, height = vertical): string {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

      const divisor = gcd(width, height)
      const simpleW = width / divisor
      const simpleH = height / divisor

      // Option A: Fix width to 16
      const heightFrom16 = (16 / simpleW) * simpleH
      const diff16 = Math.abs((width / height) - (16 / heightFrom16))

      // Option B: Fix height to 9
      const widthFrom9 = (9 / simpleH) * simpleW
      const diff9 = Math.abs((width / height) - (widthFrom9 / 9))

      if (diff16 < diff9) {
         return `${16}:${toFixedNumber(heightFrom16)}`
      } else {
         return `${toFixedNumber(widthFrom9)}:${9}`
      }
   }

   function getDisplaySizeCm(widthPx = horizontal, heightPx = vertical, diagonalInches = size) {
      const diagonalPx = Math.sqrt(widthPx ** 2 + heightPx ** 2)

      const scale = diagonalInches / diagonalPx
      const widthCm = widthPx * scale * 2.54
      const heightCm = heightPx * scale * 2.54

      return toFixedNumber(widthCm)+ 'cm x ' + toFixedNumber(heightCm) + ' cm  (' + toFixedNumber(diagonalInches * 2.54) + 'cm)' + ' = ' + toFixedNumber(widthCm * heightCm) + ' cm²'
}

   function calculatePPI (widthPx = horizontal, heightPx = vertical, diagonalInches = size): number {
      const diagonalPx = Math.sqrt(widthPx ** 2 + heightPx ** 2)
      return toFixedNumber(diagonalPx / diagonalInches)
   }

   const dataStyle = 'flex-[0 1 300px]'
   const commonResList = [
      { label: '3840x2160(4K)', valueX: 3840, valueY: 2160 },
      { label: '2560x1440(QHD)', valueX: 2560, valueY: 1440 },
      { label: '1920x1080(FHD)', valueX: 1920, valueY: 1080 },
      { label: '1280x720(qHD)', valueX: 1280, valueY: 720 }
   ]

   function applyCommonRes (item: typeof commonResList[0]) {
      setHorizontal(item.valueX)
      setVertical(item.valueY)
   }

   return (
      <main className="px-4">
         <section className="mt-4">
            <h1 className="text-center font-bold mb-2 text-xl">TTK</h1>
            <div className="flex justify-center item-center">
               <InputNumber min={1} value={rof} defaultValue={600} addonBefore={'RoF'} onChange={v => v && setRof(v)} className="w-50" />
               <InputNumber min={1} value={btk} addonBefore={'BtK'} onChange={v => v && setBtk(v)} className="w-50" />
            </div>
            <p className="text-center mt-2">{ ((60 / rof) * (btk - 1) * 1000).toFixed(0) }ms</p>
         </section>

         <div className="res flex justify-center mt-16">
            {/*{ horizontal } { vertical }*/}
            <InputNumber addonBefore="Horizontal" addonAfter="px" min={1} value={horizontal} onChange={(v) => { if(v) setHorizontal(v) }} className="w-50" />
            <InputNumber addonBefore="Vertical" addonAfter="px" min={1} value={vertical} onChange={v => {if(v) setVertical(v)}} className="w-51" />
            <InputNumber addonBefore="Size" addonAfter="in" min={1} value={size} onChange={v => {if(v) setSize(v)}} className="w-38" />
         </div>
         <div className="res flex justify-center items-center mt-2">
            <span className="font-bold">Common Res:</span>
            {commonResList.map(item => (
               <Button type="link" onClick={() => { applyCommonRes(item) }} className="p-1!">{ item.label }</Button>
            ))}
         </div>
         <div className="res flex flex-wrap justify-center items-center mt-2 gap-3">
            <div className={dataStyle}><span className="font-bold">Dimensions: </span>{getDisplaySizeCm()}</div>
            <div className={dataStyle}><span className="font-bold">Aspect Ratio: </span>{getAspectRatio() + ' (' + getFixedAspectRatio() + ')'}</div>
            <div className={dataStyle}><span className="font-bold">PPI: </span>{calculatePPI()}</div>
            <Button onClick={() => setList((prev) => [...prev, { horizontal, vertical, size }])}>Remember</Button>
         </div>
         <span>
         {/*{JSON.stringify(list)}*/}
         </span>
         { list.length > 0 &&
             <Table<DisplayData> dataSource={list} className="mt-1 w-[800px] mx-auto">
                <Column title="Res" key="horizontal" render={(v) => (<span>{ v.horizontal } x { v.vertical }</span>)} />
                <Column title="Size" key="size" render={(v) => (<span>{ v.size } in</span>)} />
                <Column title="Ratio" key="ratio" render={(v) => (<span>{getAspectRatio(v.horizontal, v.vertical) + ' (' + getFixedAspectRatio(v.horizontal, v.vertical) + ')'}</span>)} />
                <Column title="PPI" key="ppi" render={(v) => (<span>{calculatePPI(v.horizontal, v.vertical, v.size)}</span>)} />
                <Column key="op" render={(_, __, index) => (<Button type="link" onClick={() => { setList(prev => prev.filter((_, i) => i !== index)) }} className="p-0!">Delete</Button>)} />
            </Table>
         }
      </main>
   )
}
