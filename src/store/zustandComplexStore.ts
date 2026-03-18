import { create } from 'zustand'

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
  
  // Actions - 修改状态的方法
  selectCells: (ids: string[]) => void  // 选择单元格的方法
  updateCell: (id: string, value: number) => void  // 更新单个单元格的方法
  batchIncrement: (amount: number) => Promise<void>  // 批量更新单元格的方法
}

// 初始化100个单元格的函数
const initializeCells = (): Record<string, Cell> => {
  const cells: Record<string, Cell> = {}
  for (let i = 1; i <= 100; i++) {
    cells[`cell-${i}`] = { id: `cell-${i}`, value: i }
  }
  return cells
}

// 创建Zustand store
export const useCellStore = create<CellState>((set, get) => ({
  // 初始状态
  cells: initializeCells(),  // 初始化100个单元格
  selectedCellIds: [],       // 初始选中为空
  loading: false,            // 初始加载状态为false

  // 选择单元格的方法
  selectCells: (ids) => set({ selectedCellIds: ids }),
  // 为什么这样写：
  // 1. 使用set函数更新状态，Zustand会自动处理状态更新
  // 2. 只更新selectedCellIds字段，其他字段保持不变
  // 3. 不这样写：如果直接修改状态对象，React不会检测到变化，组件不会重新渲染

  // 更新单个单元格的方法
  updateCell: (id, value) => set((state) => ({
    cells: {
      ...state.cells,  // 展开现有cells对象
      [id]: {
        ...state.cells[id],  // 展开要更新的单元格
        value  // 更新value字段
      }
    }
  })),
  // 为什么这样写：
  // 1. 使用函数形式的set，确保获取最新的state
  // 2. 使用展开运算符(...)创建新对象，而不是直接修改原对象
  // 3. 只更新必要的字段，避免不必要的重渲染
  // 4. 不这样写：如果直接修改state.cells[id].value，会导致状态突变，React无法检测到变化

  // 批量更新单元格的方法
  batchIncrement: async (amount) => {
    // 1. 设置加载状态为true
    set({ loading: true })
    
    // 2. 模拟异步操作（例如API调用或复杂计算）
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 3. 获取当前状态
    const { selectedCellIds, cells } = get()
    
    // 4. 创建cells的浅拷贝
    const updatedCells = { ...cells }
    
    // 5. 遍历选中的单元格，更新值
    selectedCellIds.forEach(id => {
      if (updatedCells[id]) {
        updatedCells[id] = {
          ...updatedCells[id],  // 展开现有单元格
          value: updatedCells[id].value + amount  // 更新值
        }
      }
    })
    
    // 6. 更新状态，设置loading为false
    set({ cells: updatedCells, loading: false })
  }
  // 为什么这样写：
  // 1. 异步处理：使用async/await处理异步操作，避免阻塞主线程
  // 2. 状态管理：先设置loading为true，操作完成后设置为false
  // 3. 不可变更新：使用展开运算符创建新对象，而不是直接修改原对象
  // 4. 批量更新：一次性更新所有选中的单元格，减少状态更新次数
  // 5. 不这样写：如果同步处理大量数据，会阻塞主线程，导致界面卡顿
  // 6. 不这样写：如果直接修改原对象，会导致状态突变，React无法正确检测变化
}))

// Zustand性能优化原理：
// 1. 自动订阅：组件只订阅它使用的状态字段，而不是整个store
// 2. 浅比较：Zustand使用浅比较来检测状态变化，只有当状态真正改变时才触发重渲染
// 3. 不可变更新：通过创建新对象而不是修改原对象，确保状态变化可以被正确检测
// 4. 无Provider：不需要像Redux那样使用Provider包装整个应用

// 例如，当一个组件只使用selectedCellIds时：
// const selectedCellIds = useCellStore(state => state.selectedCellIds)
// 只有当selectedCellIds变化时，该组件才会重新渲染
// 即使其他状态（如cells）发生变化，该组件也不会重新渲染