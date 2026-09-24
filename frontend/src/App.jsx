import { Outlet, useLocation } from "react-router-dom";
import { 
  Header,
  SidebarDrawer
} from "./components";
import { useState, useEffect } from "react";

function App() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation();

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
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
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
  );
}

export default App;