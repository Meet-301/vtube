import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MantineProvider, createTheme, Notification } from '@mantine/core'
import '@mantine/core/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
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
  Search,
  Login,
  Register,
  ForgotPassword,
  VerifyEmail,
  ResetPassword,
  CreatePlaylist,
  EditPlaylist
} from './pages'

import classes from './Notifications.module.css'

const theme = createTheme({
    primaryColor: "vtube",

    components: {
      Notification: Notification.extend({
        classNames: classes
      })
    },

    colors: {
        vtube: [
            "#e8f1ff",
            "#cfe0ff",
            "#a8c7ff",
            "#7facff",
            "#568fff",
            "#2f75ff",
            "#0066ff",
            "#0052cc",
            "#003d99",
            "#002966",
        ],
    },

    defaultRadius: "md",

    fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App/>} path='/'>
      <Route element={<Home/>} path='' />
      <Route element={<Watch/>} path='watch' />
      <Route element={<History/>} path='history' />
      <Route element={<Channel/>} path='channel' />
      <Route element={<Subscriptions/>} path='subscriptions' />
      <Route element={<Playlists/>} path='playlists' />
      <Route element={<CreatePlaylist/>} path='playlists/create' />
      <Route element={<EditPlaylist/>} path='playlists/edit' />
      <Route element={<LikedVideos/>} path='liked-videos' />
      <Route element={<ManageAccount/>} path='manage-account' />
      <Route element={<UploadVideo/>} path='upload-video' />
      <Route element={<EditVideo/>} path='edit-video' />
      <Route element={<EditChannel/>} path='edit-channel' />
      <Route element={<Search/>} path='search' />
      <Route element={<Login/>} path='login' />
      <Route element={<Register/>} path='register' />
      <Route element={<ForgotPassword/>} path='forgot-password' />
      <Route element={<VerifyEmail/>} path='verify-email' />
      <Route element={<ResetPassword/>} path='reset-password' />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
