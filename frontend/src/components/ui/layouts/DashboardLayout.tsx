import { Toaster } from "sonner";
import { MobileDock } from "@/components/mobile-dock"; 
import { SidebarProvider } from "../sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <section className="flex min-h-screen w-full">
        <aside className="hidden md:block w-64 bg-white">
          <AppSidebar />
        </aside>
        <main className="flex-1">
          <Toaster />
          <Outlet />
        </main>

        <MobileDock />
      </section>
    </SidebarProvider>
  );
}
