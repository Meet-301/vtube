import { SidebarItem, YouSection } from "./index.js";

import {
  HouseIcon,
  ClockCounterClockwiseIcon,
  UserCirclePlusIcon,
  QuestionIcon,
  QueueIcon,
  UserIcon,
} from "@phosphor-icons/react";

function Sidebar() {

  return (
        <aside
          className="
            hidden
            w-60
            shrink-0
            sticky
            top-16
            z-40
            h-[calc(100vh-4rem)]
            lg:flex
          "
        >

        <nav
          className="
            flex
            w-24
            flex-col
            gap-1
            px-3
            py-4
          "
        >

        <SidebarItem
          label="Home"
          icon={HouseIcon}
          url="/"
        />

        <SidebarItem
          label="Playlists"
          icon={QueueIcon}
          url="/playlists"
        />

        <YouSection />

      </nav>
    </aside>
  );
}

export default Sidebar;