import React, { useState, useCallback } from 'react'
import { useCellContext } from '../../store/contextComplexStore'

const ContextForm: React.FC = () => {
  const { state, selectCells, batchIncrement } = useCellContext()
  const { cells, selectedCellIds, loading } = state
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 })

  const handleSelectRange = useCallback((start: number, end: number) => {
    setSelectedRange({ start, end })
    const selectedIds = []
    for (let i = start; i <= end; i++) {
      selectedIds.push(`cell-${i}`)
    }
    selectCells(selectedIds)
  }, [selectCells])

  const handleBatchIncrement = useCallback(() => {
    batchIncrement(1)
  }, [batchIncrement])

  return (
    <div className="card">
      <h2 className="title">Context API 复杂表单</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>选择范围：</label>
        <input 
          type="number" 
          value={selectedRange.start} 
          onChange={(e) => setSelectedRange({ ...selectedRange, start: parseInt(e.target.value) })} 
          min="1" 
          max="100"
        />
        <span> 到 </span>
        <input 
          type="number" 
          value={selectedRange.end} 
          onChange={(e) => setSelectedRange({ ...selectedRange, end: parseInt(e.target.value) })} 
          min="1" 
          max="100"
        />
        <button onClick={() => handleSelectRange(selectedRange.start, selectedRange.end)}>选择</button>
      </div>

      <button 
        onClick={handleBatchIncrement} 
        disabled={loading || selectedCellIds.length === 0}
        style={{ marginBottom: '20px' }}
      >
        {loading ? '处理中...' : `统一加 1 (已选择 ${selectedCellIds.length} 个单元格)`}
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(10, 1fr)', 
        gap: '5px', 
        maxWidth: '600px', 
        margin: '0 auto'
      }}>
        {Array.from({ length: 100 }, (_, index) => {
          const cellId = `cell-${index + 1}`
          const cell = cells[cellId] || { id: cellId, value: index + 1 }
          const isSelected = selectedCellIds.includes(cellId)
          
          return (
            <div 
              key={cellId}
              style={{
                border: isSelected ? '2px solid #646cff' : '1px solid #666',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: isSelected ? '#646cff10' : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => handleSelectRange(index + 1, index + 1)}
            >
              {cell.value}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContextForm