import { InputNumber } from 'antd'

export default function Calc () {
   return (
      <InputNumber min={1} max={10} defaultValue={3} onChange={() => {}} />
   )
}