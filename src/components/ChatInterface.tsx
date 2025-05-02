
import React, { useState } from "react";
import { Send, Image, Mic, Phone, Video, MessageCircle, Share2 } from "lucide-react";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
  read: boolean;
  media?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Hey! How's your day going?", time: "10:23", read: true },
    { id: 2, sender: "me", text: "Pretty good! Just finished testing the new hologram feature.", time: "10:25", read: true },
    { id: 3, sender: "other", text: "That's awesome! Can you show me how it works later?", time: "10:26", read: true },
    { id: 4, sender: "me", text: "Sure thing! I'll send you a demo in a bit.", time: "10:28", read: true },
    { id: 5, sender: "other", text: "Check out this new AR filter I found!", time: "10:30", read: true, media: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81" },
    { id: 6, sender: "me", text: "Wow! That looks incredible. Did you try the spatial audio feature too?", time: "10:32", read: true },
    { id: 7, sender: "other", text: "Not yet, is it available in the latest update?", time: "10:33", read: true },
    { id: 8, sender: "me", text: "Yeah, just released yesterday. It completely transforms the calling experience!", time: "10:35", read: true }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: messages.length + 2,
        sender: "other",
        text: "That's interesting! Tell me more...",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-cyber-light/30 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Avatar 
            src="https://i.pravatar.cc/150?img=32" 
            fallback="AM" 
            className="w-10 h-10" 
            online={true}
          />
          <div>
            <h2 className="font-medium">Alex Mercer</h2>
            <p className="text-xs text-white/60">Online • Last seen just now</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5 text-white/80" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Video className="w-5 h-5 text-white/80" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none space-y-4 bg-cyber-dark bg-cyber-grid bg-[length:30px_30px]">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={cn(
              "max-w-[80%] animate-fade-in",
              message.sender === "me" ? "ml-auto" : "mr-auto"
            )}
          >
            <div className="flex items-end gap-2">
              {message.sender === "other" && (
                <Avatar 
                  src="https://i.pravatar.cc/150?img=32" 
                  fallback="AM" 
                  className="w-8 h-8 mb-1" 
                />
              )}
              
              <div
                className={cn(
                  "rounded-xl p-3 relative",
                  message.sender === "me" 
                    ? "bg-gradient-to-br from-neon-purple/40 to-neon-blue/30 border border-white/10" 
                    : "bg-cyber-light/80 border border-white/5"
                )}
              >
                {message.media && (
                  <div className="mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={message.media} 
                      alt="Media" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-white">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-white/40">{message.time}</span>
                  {message.sender === "me" && (
                    <svg className="w-3 h-3 text-white/40" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L2.324 8.384a.75.75 0 111.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 01.02-.022zm-.92 5.14l.92.92a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 10-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                    </svg>
                  )}
                </div>
                
                <div className={cn(
                  "absolute bottom-0 w-3 h-3 transform",
                  message.sender === "me" ? "-right-1.5 rotate-45 bg-neon-blue/30" : "-left-1.5 rotate-45 bg-cyber-light/80"
                )} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-white/10 bg-cyber-light/30 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80">
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full p-3 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-neon-blue/30 placeholder-white/40"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button 
                onClick={handleSendMessage}
                className="p-2 rounded-full bg-neon-blue/20 hover:bg-neon-blue/30 transition-colors text-neon-blue"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
