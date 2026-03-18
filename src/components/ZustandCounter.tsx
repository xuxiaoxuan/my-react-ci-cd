import React from 'react'
import { useCounterStore } from '../store/zustandStore.ts'

const ZustandCounter: React.FC = () => {
  const { value, increment, decrement, incrementByAmount } = useCounterStore()

  return (
    <div className="card">
      <h2 className="title">Zustand</h2>
      <div className="count">{value}</div>
      <div>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={() => incrementByAmount(5)}>+5</button>
      </div>
    </div>
  )
}

export default ZustandCounter