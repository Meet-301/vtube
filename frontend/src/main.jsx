import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import {Home, Watch} from './pages'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path='/'>
      <Route element={<Home/>} path='' />
      <Route element={<Watch/>} path='watch' />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
