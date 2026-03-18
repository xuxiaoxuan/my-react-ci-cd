import React from 'react'
import { useCounterContext } from '../store/contextStore.tsx'

const ContextCounter: React.FC = () => {
  const { value, increment, decrement, incrementByAmount } = useCounterContext()

  return (
    <div className="card">
      <h2 className="title">React Context API</h2>
      <div className="count">{value}</div>
      <div>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={() => incrementByAmount(5)}>+5</button>
      </div>
    </div>
  )
}

export default ContextCounter