import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, SignedIn } from "@clerk/clerk-react";
import { MapPlus, MessageCircle, Folder, UsersRound, SignalIcon } from "lucide-react";

interface DockItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const userItems: DockItem[] = [
  { title: "Maps", url: "/cameras", icon: MapPlus },
  { title: "View Roadworks", url: "/alerts", icon: MessageCircle },
  { title: "Leaderboard", url: "/events", icon: Folder },
];
const adminItems: DockItem[] = [
  { title: "Dashboard", url: "/", icon: Folder },
  { title: "Camera Feeds", url: "/cameraFeed", icon: MapPlus },
  { title: "Manage Roads", url: "/roads", icon: UsersRound },
  { title: "Signal", url: "/signals", icon: SignalIcon },
];
const volunteerItems: DockItem[] = [
  { title: "Assigned Cameras", url: "/cameras", icon: MapPlus },
  { title: "Alerts", url: "/alerts", icon: MessageCircle },
  { title: "Event Feed", url: "/events", icon: Folder },
];

export const MobileDock: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  if (!isSignedIn || !user) return null;

  const role = user.publicMetadata?.role;
  const items = role === "admin" ? adminItems : role === "volunteer" ? volunteerItems : userItems;

  return (
    <SignedIn>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 shadow-xl md:hidden z-50">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === "/dashboard" + item.url;
          return (
            <Link
              key={item.title}
              to={"/dashboard" + item.url}
              className={`flex flex-col items-center text-sm ${active ? "text-primary" : "text-gray-500"}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px]">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </SignedIn>
  );
};
