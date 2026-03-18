import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

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

// 初始状态
const initialState: CellState = {
  cells: {},           // 初始为空对象
  selectedCellIds: [], // 初始选中为空
  loading: false       // 初始加载状态为false
}

// 初始化100个单元格的函数
const initializeCells = () => {
  const cells: Record<string, Cell> = {}
  for (let i = 1; i <= 100; i++) {
    cells[`cell-${i}`] = { id: `cell-${i}`, value: i }
  }
  return cells
}

// 初始化状态（包含100个单元格）
const initializedState: CellState = {
  ...initialState,      // 展开初始状态
  cells: initializeCells()  // 设置初始化的单元格
}

// 批量更新单元格的异步 thunk
export const batchIncrementCells = createAsyncThunk(
  'cells/batchIncrement',  // action类型名称
  async (amount: number, { getState }) => {
    // 获取当前状态
    const state = getState() as { cell: CellState }
    const selectedIds = state.cell.selectedCellIds
    
    // 模拟异步计算（例如API调用或复杂计算）
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 返回结果，会传递给fulfilled reducer
    return { selectedIds, amount }
  }
)
// 为什么这样写：
// 1. 使用createAsyncThunk处理异步操作，自动生成pending、fulfilled、rejected三个action
// 2. 异步操作与状态更新分离，代码更清晰
// 3. 自动处理加载状态，无需手动管理
// 4. 不这样写：如果使用同步action，会阻塞主线程，导致界面卡顿

// 创建状态切片
const cellSlice = createSlice({
  name: 'cell',  // 切片名称
  initialState: initializedState,  // 初始状态
  reducers: {
    // 选择单元格的action
    selectCells: (state, action) => {
      state.selectedCellIds = action.payload  // 直接修改state（Redux Toolkit允许这样做）
    },
    // 更新单个单元格的action
    updateCell: (state, action) => {
      const { id, value } = action.payload
      state.cells[id].value = value  // 直接修改state
    }
  },
  // 处理异步action
  extraReducers: (builder) => {
    builder
      // 处理异步操作开始
      .addCase(batchIncrementCells.pending, (state) => {
        state.loading = true  // 设置加载状态为true
      })
      // 处理异步操作成功
      .addCase(batchIncrementCells.fulfilled, (state, action) => {
        const { selectedIds, amount } = action.payload
        // 遍历选中的单元格，更新值
        selectedIds.forEach(id => {
          if (state.cells[id]) {
            state.cells[id].value += amount
          }
        })
        state.loading = false  // 设置加载状态为false
      })
  }
})
// 为什么这样写：
// 1. 使用createSlice自动生成action creators和reducer
// 2. Redux Toolkit使用Immer库，允许直接修改state，内部会自动创建不可变的状态更新
// 3. 分离同步和异步action的处理逻辑
// 4. 不这样写：如果手动创建reducer，需要手动处理不可变更新，代码更复杂

// 选择器 - 用于从state中提取数据
const selectCells = (state: { cell: CellState }) => state.cell.cells  // 提取cells
const selectSelectedCellIds = (state: { cell: CellState }) => state.cell.selectedCellIds  // 提取selectedCellIds

// 缓存选中单元格的数据（使用reselect优化性能）
export const selectSelectedCells = createSelector(
  [selectCells, selectSelectedCellIds],  // 依赖的选择器
  (cells, selectedIds) => {
    return selectedIds.map(id => cells[id]).filter(Boolean)  // 计算选中的单元格
  }
)
// 为什么这样写：
// 1. 使用createSelector创建记忆化的选择器
// 2. 只有当依赖的状态（cells或selectedCellIds）变化时，才会重新计算
// 3. 避免重复计算，提升性能
// 4. 不这样写：如果每次都重新计算，会影响性能，特别是当数据量大时

// 导出action creators
export const { selectCells: selectCellsAction, updateCell } = cellSlice.actions

// 基础计数器的slice（用于兼容基础计数器示例）
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action) => { state.value += action.payload },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 配置Redux store
export const store = configureStore({
  reducer: {
    cell: cellSlice.reducer,      // 注册cell切片的reducer
    counter: counterSlice.reducer,  // 注册counter切片的reducer
  },
})
// 为什么这样写：
// 1. 使用configureStore自动配置Redux store
// 2. 集成了Redux DevTools和中间件
// 3. 简化了store的配置过程
// 4. 不这样写：如果手动创建store，需要手动配置中间件，代码更复杂

// 导出类型
export type RootState = ReturnType<typeof store.getState>  // 根状态类型
export type AppDispatch = typeof store.dispatch  // 调度器类型

// Redux性能优化原理：
// 1. 记忆化选择器：使用reselect创建记忆化的选择器，避免重复计算
// 2. 不可变更新：Redux Toolkit使用Immer库，确保状态更新是不可变的
// 3. 组件订阅：使用useSelector订阅特定的状态字段，而不是整个state
// 4. 异步处理：使用createAsyncThunk处理异步操作，避免阻塞主线程

// 例如，当一个组件只使用selectedCellIds时：
// const selectedCellIds = useSelector((state: RootState) => state.cell.selectedCellIds)
// 只有当selectedCellIds变化时，该组件才会重新渲染
// 即使其他状态（如cells）发生变化，该组件也不会重新渲染