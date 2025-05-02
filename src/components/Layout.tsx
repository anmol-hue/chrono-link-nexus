
import React from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-cyber-dark">
      <Sidebar />
      <main className={cn("flex-1 overflow-hidden", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
