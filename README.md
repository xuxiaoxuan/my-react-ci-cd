# React 状态管理对比示例

本项目展示了三种常见的 React 状态管理方案的实现和使用方式：
1. **Redux Toolkit**
2. **Zustand**
3. **React Context API**

## 项目结构

```
src/
├── components/
│   ├── ReduxCounter.tsx       # Redux Toolkit 示例组件
│   ├── ZustandCounter.tsx     # Zustand 示例组件
│   └── ContextCounter.tsx     # React Context API 示例组件
├── store/
│   ├── reduxStore.ts          # Redux Toolkit 状态管理
│   ├── zustandStore.ts        # Zustand 状态管理
│   └── contextStore.tsx       # React Context API 状态管理
├── App.tsx                    # 主应用组件
├── main.tsx                   # 应用入口
└── index.css                  # 样式文件
```

## 三种状态管理方案的对比

### 1. React Context API

**优点：**
- 内置在 React 中，无需额外依赖
- 实现简单，代码量少
- 适合小型应用或局部状态管理

**缺点：**
- 性能问题：当 Context 值变化时，所有消费该 Context 的组件都会重新渲染
- 不适合复杂的全局状态管理
- 状态逻辑分散在组件中

**使用场景：**
- 简单的全局状态（如主题、用户信息）
- 组件树中共享的局部状态

### 2. Redux Toolkit

**优点：**
- 强大的状态管理能力，适合复杂应用
- 可预测性强，状态变更有明确的 action
- 丰富的中间件生态（如 thunk、saga）
- 良好的开发者工具支持

**缺点：**
- 代码量较大，配置复杂
- 学习曲线较陡
- 对于小型应用可能过于复杂

**使用场景：**
- 大型应用的全局状态管理
- 需要复杂状态逻辑的应用
- 需要时间旅行调试的应用

### 3. Zustand

**优点：**
- 简洁的 API，代码量少
- 性能优异，只更新使用到的状态
- 无需 Provider 包装
- 支持中间件
- 学习曲线平缓

**缺点：**
- 生态相对 Redux 较小
- 开发者工具支持不如 Redux

**使用场景：**
- 中小型应用的状态管理
- 对性能有要求的应用
- 希望简化状态管理代码的场景

## 如何运行

1. 安装依赖
   ```bash
   npm install
   ```

2. 启动开发服务器
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 http://localhost:5177/ 查看示例

## 代码说明

### React Context API
- 使用 `createContext` 创建上下文
- 使用 `useState` 管理状态
- 使用 `useContext` 消费状态

### Redux Toolkit
- 使用 `createSlice` 创建切片
- 使用 `configureStore` 配置 store
- 使用 `useSelector` 选择状态
- 使用 `useDispatch` 分发 action

### Zustand
- 使用 `create` 创建 store
- 直接通过 hook 访问和修改状态
- 状态逻辑集中在 store 中

## 总结

- **Context API**：适合简单场景，内置方案，无需额外依赖
- **Redux Toolkit**：适合复杂应用，功能强大，生态丰富
- **Zustand**：平衡了简洁性和功能性，适合大多数应用场景

