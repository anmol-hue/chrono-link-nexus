
import React, { useState } from "react";
import { MicOff, VideoOff, Phone, MessageCircle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";

interface Participant {
  id: number;
  name: string;
  avatar: string;
  video: boolean;
  audio: boolean;
  speaking: boolean;
}

const VideoCall: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "You", avatar: "https://i.pravatar.cc/150?img=11", video: true, audio: false, speaking: false },
    { id: 2, name: "Alex Mercer", avatar: "https://i.pravatar.cc/150?img=32", video: true, audio: true, speaking: true },
    { id: 3, name: "Elena Fisher", avatar: "https://i.pravatar.cc/150?img=23", video: false, audio: true, speaking: false },
    { id: 4, name: "Marcus Holloway", avatar: "https://i.pravatar.cc/150?img=59", video: true, audio: true, speaking: false },
  ]);
  
  const [fullscreen, setFullscreen] = useState<number | null>(2);
  
  const toggleMute = (id: number) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, audio: !p.audio } : p)
    );
  };
  
  const toggleVideo = (id: number) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, video: !p.video } : p)
    );
  };
  
  const setFullscreenUser = (id: number | null) => {
    setFullscreen(id);
  };
  
  const mainParticipant = fullscreen ? participants.find(p => p.id === fullscreen) : null;
  const otherParticipants = participants.filter(p => p.id !== fullscreen);
  
  return (
    <div className="flex flex-col h-full bg-cyber-dark bg-cyber-grid bg-[length:30px_30px] relative overflow-hidden">
      {/* Connection status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-cyber-light/50 backdrop-blur-sm py-1 px-3 rounded-full">
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
        <span className="text-xs text-white/80">Connected • 12:45</span>
      </div>
      
      {/* Main video */}
      <div className="flex-1 relative">
        {mainParticipant ? (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {mainParticipant.video ? (
              <img 
                src={`https://source.unsplash.com/random/1920x1080/?person&id=${mainParticipant.id}`} 
                alt={mainParticipant.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cyber-light/30 flex items-center justify-center">
                <Avatar
                  src={mainParticipant.avatar}
                  fallback={mainParticipant.name.substring(0, 2)}
                  className="w-32 h-32"
                />
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-cyber-dark/70 backdrop-blur-sm py-1 px-3 rounded-full">
              <span className="text-sm text-white">{mainParticipant.name}</span>
              {mainParticipant.speaking && (
                <Volume2 className="w-4 h-4 text-neon-green" />
              )}
            </div>
            
            {mainParticipant.id === 1 && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => toggleMute(1)}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-sm transition-colors",
                    mainParticipant.audio 
                      ? "bg-cyber-dark/50 hover:bg-cyber-dark/70" 
                      : "bg-red-500/70 hover:bg-red-500/90"
                  )}
                >
                  {mainParticipant.audio ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>
                
                <button 
                  onClick={() => toggleVideo(1)}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-sm transition-colors",
                    mainParticipant.video 
                      ? "bg-cyber-dark/50 hover:bg-cyber-dark/70" 
                      : "bg-red-500/70 hover:bg-red-500/90"
                  )}
                >
                  {mainParticipant.video ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-cyber-light/20 flex items-center justify-center">
            <p className="text-white/60">No active video</p>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 max-h-[calc(100%-8rem)]">
        {otherParticipants.map(participant => (
          <div 
            key={participant.id}
            onClick={() => setFullscreenUser(participant.id)}
            className="w-48 h-32 rounded-lg overflow-hidden border-2 border-transparent hover:border-neon-blue cursor-pointer relative shadow-lg transition-all hover:scale-105"
          >
            {participant.video ? (
              <img 
                src={`https://source.unsplash.com/random/480x320/?person&id=${participant.id}`} 
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cyber-light/40 flex items-center justify-center">
                <Avatar
                  src={participant.avatar}
                  fallback={participant.name.substring(0, 2)}
                  className="w-16 h-16"
                />
              </div>
            )}
            
            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between bg-cyber-dark/70 backdrop-blur-sm py-0.5 px-2 rounded-full text-[10px]">
              <span className="text-white/90 truncate">{participant.name}</span>
              {participant.speaking && (
                <Volume2 className="w-3 h-3 text-neon-green" />
              )}
              {!participant.audio && (
                <MicOff className="w-3 h-3 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="p-4 flex justify-center">
        <div className="bg-cyber-light/30 backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-4 border border-white/10 shadow-lg">
          <button 
            onClick={() => toggleMute(1)}
            className={cn(
              "p-3 rounded-full transition-colors",
              participants[0].audio 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {participants[0].audio ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
          
          <button 
            onClick={() => toggleVideo(1)}
            className={cn(
              "p-3 rounded-full transition-colors",
              participants[0].video 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {participants[0].video ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>
          
          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
          
          <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
            <MessageCircle className="w-6 h-6" />
          </button>
          
          <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors text-white">
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
