import React, { createContext, useState, useContext } from 'react'

// interface CounterContextType {
//   value: number
//   increment: () => void
//   decrement: () => void
//   incrementByAmount: (amount: number) => void
// }

// 创建 Context,创建上下文
const CounterContext = createContext<CounterContextType | undefined>(undefined)

// 创建 Provider,提供上下文
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState(0)

  const increment = () => {
    setValue(value + 1)
  }

  const decrement = () => {
    setValue(value - 1)
  }

  const incrementByAmount = (amount: number) => {
    setValue(value + amount)
  }

  return (
    <CounterContext.Provider value={{ value, increment, decrement, incrementByAmount }}>
      {children}
    </CounterContext.Provider>
  )
}

// 创建自定义 Hook,使用上下文
export const useCounterContext = () => {
  const context = useContext(CounterContext)
  if (context === undefined) {
    throw new Error('useCounterContext must be used within a ContextProvider')
  }
  return context
}