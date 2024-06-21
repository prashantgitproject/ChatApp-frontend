import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import store from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <div className='' onContextMenu={e => e.preventDefault()} >
          <App />
        </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)
