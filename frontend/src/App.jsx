import { Header, Sidebar, CategoryBar, SidebarDrawer } from "./components";
import { Home } from "./pages";
import { useState, useEffect } from "react";

function App() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      <div
        className={`
            sticky top-0 z-50
            transition-all duration-300
            ${isScrolled
            ? "bg-background/75 backdrop-blur-xl"
            : "bg-transparent"
          }
        `}
      >
        <Header onMenuClick={() => setIsDrawerOpen(true)} />

        <div className="flex min-w-0">
          <div className="hidden lg:block w-24 lg:w-48 xl:w-60 shrink-0" />

          <div className="min-w-0 flex-1">
            <CategoryBar />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet drawer — OUTSIDE glass wrapper */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Main */}
      <div className="flex min-w-0">
        <Sidebar />

        <main className="min-w-0 flex-1">
          {/* pages */}
          <Home />
        </main>
      </div>

    </div>
  );
}

export default App;