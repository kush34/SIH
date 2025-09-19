import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <section className="flex min-h-screen w-full">
        <aside className="hidden md:block w-64 bg-white">
          <AppSidebar />
        </aside>

        <div className="md:hidden fixed top-4 left-4 z-50">
          <SidebarTrigger />
        </div>

        <main className="flex-1 p-4 md:p-6 ">
          <Toaster />
          <Outlet /> 
        </main>
      </section>
    </SidebarProvider>
  );
}