
import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  fallback: string;
  className?: string;
  online?: boolean;
  away?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ src, fallback, className, online, away }) => {
  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-cyber-light text-white",
        className
      )}>
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-medium">{fallback}</span>
        )}
      </div>
      
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className="w-3 h-3 rounded-full bg-neon-green border-2 border-cyber-dark" />
          <div className="absolute inset-0 rounded-full bg-neon-green animate-ping opacity-75" />
        </div>
      )}
      
      {away && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-cyber-dark" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
