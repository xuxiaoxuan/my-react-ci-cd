import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'

// 定义单元格类型
interface Cell {
  id: string           // 单元格唯一标识
  value: number        // 单元格值
  formula?: string     // 可选的公式
  dependencies?: string[]  // 可选的依赖单元格ID
}

// 定义状态类型
interface CellState {
  cells: Record<string, Cell>  // 存储所有单元格的对象
  selectedCellIds: string[]     // 选中的单元格ID数组
  loading: boolean              // 加载状态
}

// 定义action类型
type CellAction =  
  | { type: 'SELECT_CELLS'; payload: string[] }
  | { type: 'UPDATE_CELL'; payload: { id: string; value: number } }
  | { type: 'BATCH_INCREMENT_START' }
  | { type: 'BATCH_INCREMENT_SUCCESS'; payload: { selectedIds: string[]; amount: number } }

// 初始化100个单元格的函数
const initializeCells = (): Record<string, Cell> => {
  const cells: Record<string, Cell> = {}
  for (let i = 1; i <= 100; i++) {
    cells[`cell-${i}`] = { id: `cell-${i}`, value: i }
  }
  console.log('初始化单元格:', cells)
  return cells
}

// 初始状态
const initialState: CellState = {
  cells: initializeCells(),  // 初始化100个单元格
  selectedCellIds: [],       // 初始选中为空
  loading: false             // 初始加载状态为false
}

// 状态reducer
const cellReducer = (state: CellState, action: CellAction): CellState => {
  switch (action.type) {
    case 'SELECT_CELLS':
      // 更新选中的单元格
      return { ...state, selectedCellIds: action.payload }
    case 'UPDATE_CELL':
      // 更新单个单元格的值
      return {
        ...state,  // 展开现有状态
        cells: {
          ...state.cells,  // 展开现有cells
          [action.payload.id]: {
            ...state.cells[action.payload.id],  // 展开要更新的单元格
            value: action.payload.value  // 更新value
          }
        }
      }
    case 'BATCH_INCREMENT_START':
      // 开始批量更新，设置loading为true
      return { ...state, loading: true }
    case 'BATCH_INCREMENT_SUCCESS':
      // 批量更新成功
      const { selectedIds, amount } = action.payload
      const updatedCells = { ...state.cells }  // 创建cells的浅拷贝
      // 遍历选中的单元格，更新值
      selectedIds.forEach(id => {
        if (updatedCells[id]) {
          updatedCells[id] = {
            ...updatedCells[id],  // 展开现有单元格
            value: updatedCells[id].value + amount  // 更新值
          }
        }
      })
      return { ...state, cells: updatedCells, loading: false }  // 更新状态
    default:
      return state
  }
}
// 为什么这样写：
// 1. 使用useReducer管理复杂状态，适合有多个状态和复杂更新逻辑的场景
// 2. 使用不可变更新（展开运算符），确保状态变化可以被React检测到
// 3. 集中处理所有状态更新逻辑，代码更清晰
// 4. 不这样写：如果使用多个useState，状态管理会变得混乱，难以维护

// 定义Context类型
interface CellContextType {
  state: CellState
  selectCells: (ids: string[]) => void
  batchIncrement: (amount: number) => void
  updateCell: (id: string, value: number) => void
}

// 创建Context
const CellContext = createContext<CellContextType | undefined>(undefined)
// 为什么这样写：
// 1. 创建Context，用于在组件树中共享状态
// 2. 初始值为undefined，确保组件必须在Provider内部使用
// 3. 不这样写：如果不使用Context，需要通过props逐层传递状态，代码会变得冗长

// 创建Provider组件
export const CellProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用useReducer管理状态
  const [state, dispatch] = useReducer(cellReducer, initialState)

  // 选择单元格的方法（使用useCallback缓存）
  const selectCells = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_CELLS', payload: ids })
  }, [])
  // 为什么这样写：
  // 1. 使用useCallback缓存函数，避免每次渲染都创建新函数
  // 2. 依赖项数组为空，因为函数不依赖任何外部变量
  // 3. 不这样写：如果不使用useCallback，每次渲染都会创建新函数，可能导致子组件不必要的重渲染

  // 更新单个单元格的方法（使用useCallback缓存）
  const updateCell = useCallback((id: string, value: number) => {
    dispatch({ type: 'UPDATE_CELL', payload: { id, value } })
  }, [])
  // 为什么这样写：
  // 1. 使用useCallback缓存函数，避免每次渲染都创建新函数
  // 2. 依赖项数组为空，因为函数不依赖任何外部变量
  // 3. 不这样写：如果不使用useCallback，每次渲染都会创建新函数，可能导致子组件不必要的重渲染

  // 批量更新单元格的方法（使用useCallback缓存）
  const batchIncrement = useCallback((amount: number) => {
    dispatch({ type: 'BATCH_INCREMENT_START' })
    
    // 模拟异步操作
    setTimeout(() => {
      dispatch({
        type: 'BATCH_INCREMENT_SUCCESS',
        payload: { selectedIds: state.selectedCellIds, amount }
      })
    }, 50)
  }, [state.selectedCellIds])
  // 为什么这样写：
  // 1. 使用useCallback缓存函数，避免每次渲染都创建新函数
  // 2. 依赖项数组包含state.selectedCellIds，因为函数依赖这个状态
  // 3. 异步处理：使用setTimeout模拟异步操作，避免阻塞主线程
  // 4. 不这样写：如果不使用useCallback，每次渲染都会创建新函数，可能导致子组件不必要的重渲染
  // 5. 不这样写：如果同步处理大量数据，会阻塞主线程，导致界面卡顿

  return (
    <CellContext.Provider value={{ state, selectCells, batchIncrement, updateCell }}>
      {children}
    </CellContext.Provider>
  )
}
// 为什么这样写：
// 1. 创建Provider组件，提供状态和方法给子组件
// 2. 将状态和方法作为Context的值传递
// 3. 不这样写：如果不使用Provider，Context将没有值，组件无法使用

// 创建自定义hook，用于在组件中使用Context
export const useCellContext = () => {
  const context = useContext(CellContext)
  if (context === undefined) {
    throw new Error('useCellContext must be used within a CellProvider')
  }
  return context
}
// 为什么这样写：
// 1. 创建自定义hook，简化Context的使用
// 2. 添加错误检查，确保组件在Provider内部使用
// 3. 不这样写：如果直接使用useContext(CellContext)，需要在每个组件中添加错误检查

// Context API性能优化原理：
// 1. useCallback：缓存函数，避免不必要的重渲染
// 2. 不可变更新：使用展开运算符创建新对象，确保状态变化可以被正确检测
// 3. 组件订阅：只有消费Context的组件会在Context值变化时重渲染
// 4. 异步处理：使用setTimeout处理异步操作，避免阻塞主线程

// 注意：Context API的一个缺点是，当Context值变化时，所有消费该Context的组件都会重渲染
// 即使组件只使用Context中的一部分值，也会重渲染
// 这与Zustand和Redux不同，它们只会在组件使用的值变化时才重渲染

// 例如，当一个组件使用useCellContext()获取整个state时：
// const { state } = useCellContext()
// 当state中的任何值（如cells、selectedCellIds、loading）变化时，该组件都会重渲染
// 即使组件只使用state.loading，当cells变化时也会重渲染