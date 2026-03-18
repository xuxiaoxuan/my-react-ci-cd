import { useState } from 'react'
import ReduxCounter from './components/ReduxCounter.tsx'
import ZustandCounter from './components/ZustandCounter.tsx'
import ContextCounter from './components/ContextCounter.tsx'
import ReduxForm from './components/ComplexForm/ReduxForm.tsx'
import ContextForm from './components/ComplexForm/ContextForm.tsx'
import ZustandForm from './components/ComplexForm/ZustandForm.tsx'

function App() {
  const [activeTab, setActiveTab] = useState<'basic' | 'complex'>('basic')

  return (
    <div className="container">
      <h1>React 状态管理对比</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('basic')}
          style={{
            marginRight: '10px',
            backgroundColor: activeTab === 'basic' ? '#646cff' : '#1a1a1a'
          }}
        >
          基础计数器
        </button>
        <button 
          onClick={() => setActiveTab('complex')}
          style={{
            backgroundColor: activeTab === 'complex' ? '#646cff' : '#1a1a1a'
          }}
        >
          复杂表单（100个单元格）
        </button>
      </div>

      {activeTab === 'basic' ? (
        <>
          <ReduxCounter />
          <ZustandCounter />
          <ContextCounter />
        </>
      ) : (
        <>
          <ReduxForm />
          <ContextForm />
          <ZustandForm />
        </>
      )}
    </div>
  )
}

export default App