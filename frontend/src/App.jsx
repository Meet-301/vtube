import { Outlet, useLocation } from "react-router-dom";
import {
  Header,
  SidebarDrawer
} from "./components";
import { useState, useEffect } from "react";
import api from "./api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { login, setAccessToken, setInitializing } from "./features/authSlice.js";
import { addNotification } from "./features/notificationSlice.js";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { SaveToPlaylistProvider } from "./context/SaveToPlaylistContext.jsx";
import socket from "./api/socket.js";

function App() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const isInitializing = useSelector(state => state.auth.isInitializing);
  const currentUser = useSelector(state => state.auth.user);

  const pages = [
    "/search",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password"
  ]

  const isCheckPage = pages.includes(location.pathname);

  useEffect(() => {
    async function restoreAuth() {
      try {
        const refreshResponse = await api.post(
          "/users/refresh-token"
        );

        const accessToken =
          refreshResponse.data?.data?.accessToken;

        if (!accessToken) {
          return;
        }

        dispatch(setAccessToken(accessToken));

        const userResponse = await api.get(
          "/users/current-user"
        );

        const user = userResponse.data?.data;

        dispatch(
          login({
            user,
            accessToken
          })
        );

      } catch (error) {
        console.log(
          "Auth restore failed:",
          error.response?.data || error
        );
      } finally {
        dispatch(setInitializing(false));
      }
    }

    restoreAuth();
  }, [dispatch]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //! Real-time Socket.IO notification listener
  useEffect(() => {
    if (!currentUser?._id) {
      if (socket.connected) socket.disconnect();
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", currentUser._id);

    function handleNotification(data) {
      dispatch(addNotification(data));

      notifications.show({
        title: data.type === "SUBSCRIBER" ? "New Subscriber! 🎉" : "New Video Upload! 🎥",
        message: data.message,
        color: "blue",
        autoClose: 5000,
      });
    }

    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("new_notification", handleNotification);
    };
  }, [currentUser?._id, dispatch]);

  if (isInitializing) {
    return (
      <div className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-background
        ">
        <LoadingOverlay
          visible={isInitializing}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
          loaderProps={{ color: "blue", type: "oval" }}
        />
      </div>
    );
  }

  return (
    <SaveToPlaylistProvider>
      <div className="min-h-screen bg-background text-text-primary">

        {/* Sticky glass area */}
        {!isCheckPage && (
          <div
            className={`
                  sticky top-0 z-50
                  transition-all duration-300
                  ${isScrolled
                ? "bg-surface/70 backdrop-blur-xl"
                : "bg-transparent"
              }
              `}
          >
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
          </div>
        )}

        {/* Mobile/Tablet drawer */}
        {!isCheckPage &&
          <SidebarDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        }

        {/* Main */}
        <div className="flex min-w-0">

          <main className="min-w-0 flex-1">
            {/* pages */}
            <Outlet />
          </main>
        </div>

      </div>
    </SaveToPlaylistProvider>
  );
}

export default App;