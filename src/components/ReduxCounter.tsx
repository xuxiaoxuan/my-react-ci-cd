import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement, incrementByAmount } from '../store/reduxStore.ts'

const ReduxCounter: React.FC = () => {
  const dispatch = useDispatch()
  const count = useSelector((state: any) => state.counter.value)

  return (
    <div className="card">
      <h2 className="title">Redux Toolkit</h2>
      <div className="count">{count}</div>
      <div>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(decrement())}>-1</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      </div>
    </div>
  )
}

export default ReduxCounter