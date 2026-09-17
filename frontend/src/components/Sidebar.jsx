import { SidebarItem, YouSection } from "./index.js";
import { HouseIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-40">
      <nav className="w-24 px-3 py-4 flex flex-col gap-1">

        <SidebarItem
          label="Home"
          icon={HouseIcon}
          active
        />

        <SidebarItem
          label="History"
          icon={ClockCounterClockwiseIcon}
        />

        <YouSection />

      </nav>
    </aside>
  );
}

export default Sidebar;