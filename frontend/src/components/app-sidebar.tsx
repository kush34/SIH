import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, Clock, MapPlus, UsersRound, MessageCircle, Settings, LogOut, ChartBar, SignalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignedIn, SignOutButton, useUser } from '@clerk/clerk-react';

interface SidebarItem {
    title: string;
    url: string;
    icon: React.ElementType;
}

// Sidebar items
const userItems: SidebarItem[] = [
    { title: "Maps", url: "/cameras", icon: MapPlus },
    { title: "View Roadworks", url: "/alerts", icon: MessageCircle },
    { title: "Leaderboard", url: "/events", icon: Folder },
];
const adminItems: SidebarItem[] = [
    { title: "Dashboard", url: "/", icon: Folder },
    { title: "Camera Feeds", url: "/cameraFeed", icon: MapPlus },
    { title: "Manage Roads", url: "/roads", icon: UsersRound },
    { title: "Signal", url: "/signals", icon: SignalIcon },
    { title: "Live Report", url: "/reports", icon: Clock },
    { title: "Analytics", url: "/analytics", icon: ChartBar },
];
const volunteerItems: SidebarItem[] = [
    { title: "Assigned Cameras", url: "/cameras", icon: MapPlus },
    { title: "Alerts", url: "/alerts", icon: MessageCircle },
    { title: "Event Feed", url: "/events", icon: Folder },
];

const managementItems: SidebarItem[] = [
    { title: "Settings", url: "/settings", icon: Settings },
];

export const AppSidebar: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const location = useLocation();
    const parentURL = "/dashboard";

    if (!isSignedIn || !user) return <Skeleton className="h-full md:w-[350px]" />;

    const roleName = user?.publicMetadata?.role;
    const selectedItems = roleName === "admin" ? adminItems : roleName === "volunteer" ? volunteerItems : userItems;

    return (
        <Sidebar className="h-screen px-4 py-6 space-y-6">
            <SidebarHeader className="mb-6">
                <span className="font-semibold text-2xl">SIH Brand</span>
            </SidebarHeader>

            <SidebarContent className="bg-none">
                <SidebarGroupLabel className="px-2">
                    {roleName === "admin" || roleName === "dispatcher" ? roleName.toUpperCase() : "Links"}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className="px-2">
                        {selectedItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className={parentURL + item.url === location.pathname ? "bg-primary text-white" : ""}
                                >
                                    <Link to={parentURL + item.url}>
                                        <item.icon className="mr-2" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>

                {roleName === "user" && (
                    <>
                        <SidebarGroupLabel className="px-2">Account Management</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="px-2">
                                {managementItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={parentURL + item.url === location.pathname ? "bg-primary text-white" : ""}
                                        >
                                            <Link to={parentURL + item.url}>
                                                <item.icon className="mr-2" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="flex items-center justify-center p-4">
                <div className="w-full flex items-center space-x-3">
                    <SignedIn>
                        <Avatar>
                            <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />
                            <AvatarFallback>{user?.firstName?.[0] ?? "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col mr-12 text-sm text-zinc-600">
                            <div>{user.firstName}</div>
                            <div className="text-xs text-muted-foreground">{roleName as string}</div>
                        </div>
                        <SignOutButton>
                            {/* You can wrap your own button */}
                            <button className="rounded text-red-500">
                                <LogOut  className="w-5 h-5"/>
                            </button>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};