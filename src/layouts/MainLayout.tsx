import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

export default function MainLayout() {
  useEffect(() => {
    document.title = "Bienvenidos | Claims Management System";
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const storedSidebarState = localStorage.getItem("isSidebarOpen");
    if (storedSidebarState === null) {
      localStorage.setItem("isSidebarOpen", "true");
      return true;
    }
    return storedSidebarState === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("isSidebarOpen", `${next}`);
      return next;
    });
  };

  return (
    <div className="flex min-h-dvh text-[#74788d]">
      <div className="max-h-screen h-full flex sticky top-0">
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-50">
          <Header
            onToggleSidebar={toggleSidebar}
            userAvatarUrl="https://cdn3.iconfinder.com/data/icons/communication-social-media-1/24/account_profile_user_contact_person_avatar_placeholder-512.png"
          />
        </div>

        <main className="flex-1 bg-[#f7f9ff] pt-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
