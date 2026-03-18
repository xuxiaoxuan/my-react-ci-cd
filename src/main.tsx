import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/reduxComplexStore.ts'
import { ContextProvider } from './store/contextStore.tsx'
import { CellProvider } from './store/contextComplexStore.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <CellProvider>
          <App />
        </CellProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
)