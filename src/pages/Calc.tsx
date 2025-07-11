import { InputNumber } from 'antd'

export default function Calc () {
   return (
      <main className="flex justify-center">
         <InputNumber min={1} max={10} defaultValue={3} onChange={() => {}} className="mt-4!" />
      </main>
   )
}