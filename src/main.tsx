import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRouter } from './app/router'
import { useListingsStore } from './store/listingsStore'
import './index.css'

// Initialize listings on app start
const initializeListings = () => {
  const store = useListingsStore.getState()
  store.importSeedIfEmpty()
}

initializeListings()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)

