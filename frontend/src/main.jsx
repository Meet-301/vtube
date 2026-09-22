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
import {
  ManageAccount, 
  Channel, 
  History, 
  Home, 
  LikedVideos, 
  Playlists, 
  Subscriptions, 
  Watch, 
  UploadVideo, 
  EditVideo,
  EditChannel,
  Search
} from './pages'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App/>} path='/'>
      <Route element={<Home/>} path='' />
      <Route element={<Watch/>} path='watch' />
      <Route element={<History/>} path='history' />
      <Route element={<Channel/>} path='channel' />
      <Route element={<Subscriptions/>} path='subscriptions' />
      <Route element={<Playlists/>} path='playlists' />
      <Route element={<LikedVideos/>} path='liked-videos' />
      <Route element={<ManageAccount/>} path='manage-account' />
      <Route element={<UploadVideo/>} path='upload-video' />
      <Route element={<EditVideo/>} path='edit-video' />
      <Route element={<EditChannel/>} path='edit-channel' />
      <Route element={<Search/>} path='search' />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
