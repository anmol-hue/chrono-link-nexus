
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "./Layout";
import ChatInterface from "./ChatInterface";
import VideoCall from "./VideoCall";
import { Button } from "@/components/ui/button";
import UserSettingsModal from "./UserSettingsModal";
import { cn } from "@/lib/utils";
import { MessageCircle, Video, Settings, LogOut } from "lucide-react";

interface HomePageProps {
  initialView?: "chat" | "call" | "welcome";
}

const HomePage: React.FC<HomePageProps> = ({ initialView = "welcome" }) => {
  const [activeView, setActiveView] = useState(initialView);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, signOut, userSettings } = useAuth();
  
  const getButtonClass = (type: string) => {
    const themeColorMap = {
      blue: "text-neon-blue border-neon-blue/40 bg-neon-blue/20 hover:bg-neon-blue/30",
      purple: "text-neon-purple border-neon-purple/40 bg-neon-purple/20 hover:bg-neon-purple/30",
      green: "text-neon-green border-neon-green/40 bg-neon-green/20 hover:bg-neon-green/30",
      pink: "text-neon-pink border-neon-pink/40 bg-neon-pink/20 hover:bg-neon-pink/30",
    };
    
    return themeColorMap[userSettings?.themeColor as keyof typeof themeColorMap] || themeColorMap.blue;
  };
  
  // Animation classes based on user settings
  const getAnimationClass = () => {
    switch (userSettings?.messageEffect) {
      case 'fade': return 'animate-fade-in';
      case 'slide': return 'animate-slide-in';
      case 'bounce': return 'animate-bounce';
      case 'none':
      default: return '';
    }
  };
  
  return (
    <Layout>
      {activeView === "welcome" && (
        <div className={cn("h-full flex items-center justify-center", getAnimationClass())}>
          <div className="text-center max-w-2xl p-8 rounded-xl cyber-panel">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-16 h-16 mr-3">
                <div className="absolute inset-0 rounded-full bg-neon-glow animate-pulse-soft blur-md opacity-70"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">CL</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-neon-glow animate-pulse-soft">ChronoLink</h1>
            </div>
            <p className="text-white/80 mb-8">Welcome to the next generation of communication</p>
            
            {user ? (
              <div className="mb-6">
                <p className="text-neon-green mb-4">Hello, {user.user_metadata.username || 'User'}!</p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <Button 
                    onClick={() => setActiveView("chat")}
                    className={cn("px-5 py-2.5 rounded-lg border", getButtonClass("chat"))}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Chatting
                  </Button>
                  <Button 
                    onClick={() => setActiveView("call")}
                    className={cn("px-5 py-2.5 rounded-lg border", getButtonClass("call"))}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Video Call
                  </Button>
                  <Button
                    onClick={() => setSettingsOpen(true)}
                    className={cn("px-5 py-2.5 rounded-lg border", getButtonClass("settings"))}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    onClick={() => signOut()}
                    className="px-5 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-12 relative">
                <div className="absolute -inset-[1px] bg-neon-glow rounded-lg animate-pulse opacity-30 blur-md"></div>
                <div className="relative glass-morphism p-6 rounded-lg">
                  <p className="text-lg text-white/90 mb-4">Sign in to start your futuristic communication experience</p>
                  <div className="flex justify-center gap-4 mt-6">
                    <Link to="/auth">
                      <Button 
                        className="px-5 py-2.5 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/40 transition-colors"
                      >
                        Login / Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", userSettings?.compactMode ? "text-xs" : "")}>
              <div className="p-4 rounded-lg cyber-panel hover:border-neon-blue/40 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">HD Spatial Audio</h3>
                <p className="text-white/60 text-sm">Experience calls like never before with 3D audio technology</p>
              </div>
              
              <div className="p-4 rounded-lg cyber-panel hover:border-neon-purple/40 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-purple/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">AI-Generated Content</h3>
                <p className="text-white/60 text-sm">Create custom stickers, art, and reactions instantly</p>
              </div>
              
              <div className="p-4 rounded-lg cyber-panel hover:border-neon-green/40 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Emotion-Reactive UI</h3>
                <p className="text-white/60 text-sm">Interface that adapts to your mood and conversation context</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeView === "chat" && <ChatInterface />}
      {activeView === "call" && <VideoCall />}
      
      <UserSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Layout>
  );
};

export default HomePage;
