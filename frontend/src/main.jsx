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
  PlaylistDetails
} from './pages'
import classes from './Notifications.module.css'
import { Provider } from "react-redux";
import store from './app/store.js';
import ProtectedRoute from './components/ProtectedRoute.jsx'

const theme = createTheme({
  primaryColor: "vtube",

  components: {
    Notification: Notification.extend({
      classNames: classes,
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
    <Route element={<App />} path='/'>
      <Route element={<ProtectedRoute/>}>
        <Route element={<Home />} path='' />
        <Route element={<Watch />} path='watch/:videoId' />
        <Route element={<History />} path='history' />
        <Route element={<Channel />} path='channel' />
        <Route element={<Subscriptions />} path='subscriptions' />
        <Route element={<Playlists />} path='playlists' />
        <Route element={<PlaylistDetails />} path='playlists/:id' />
        <Route element={<LikedVideos />} path='liked-videos' />
        <Route element={<ManageAccount />} path='manage-account' />
        <Route element={<UploadVideo />} path='upload-video' />
        <Route element={<EditVideo />} path='edit-video' />
        <Route element={<EditChannel />} path='edit-channel' />
        <Route element={<Search />} path='search' />
      </Route>

      <Route element={<Login />} path='login' />
      <Route element={<Register />} path='register' />
      <Route element={<ForgotPassword/>} path='forgot-password' />
      <Route element={<VerifyEmail />} path='verify-email' />
      <Route element={<ResetPassword />} path='reset-password' />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider theme={theme}>
      <Notifications autoClose={4000} />
      <RouterProvider router={router} />
    </MantineProvider>
  </Provider>
)
