
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Phone, Video, Image, CircleUser, BellRing, LogOut, UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addContactSchema = z.object({
  userIdOrEmail: z.string().min(1, "Required")
});

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const { user, signOut, contacts, loadingContacts, addContact } = useAuth();
  
  const form = useForm({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      userIdOrEmail: "",
    },
  });

  const onAddContact = async (values: z.infer<typeof addContactSchema>) => {
    try {
      await addContact(values.userIdOrEmail);
      form.reset();
      setIsAddingContact(false);
    } catch (error) {
      console.error("Failed to add contact:", error);
    }
  };

  return (
    <div className="w-80 flex flex-col h-full border-r border-white/10 bg-cyber-dark">
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-glow animate-pulse-soft"></div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-neon-glow animate-pulse-soft">ChronoLink</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <BellRing className="w-5 h-5 text-white/80" />
          </button>
          
          {user ? (
            <div className="relative group">
              <Avatar 
                src={user.user_metadata.avatar_url || "https://i.pravatar.cc/150?img=11"} 
                fallback={user.user_metadata.username?.substring(0, 2)?.toUpperCase() || "U"} 
                className="w-8 h-8 border border-white/20 hover:border-neon-blue cursor-pointer" 
                online={true} 
              />
              <div className="absolute right-0 mt-2 w-48 p-2 bg-cyber-dark border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 text-sm text-white/80">
                  <div className="font-medium">{user.user_metadata.username || 'User'}</div>
                  <div className="text-xs text-white/60 truncate">{user.email}</div>
                </div>
                <div className="border-t border-white/10 mt-1 pt-1">
                  <Button 
                    onClick={() => signOut()} 
                    variant="ghost" 
                    size="sm"
                    className="w-full flex items-center gap-2 justify-start text-white/70 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="outline" className="text-xs">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="flex items-center p-2 bg-cyber-light/30">
        <button 
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex-1 p-2 rounded-lg text-center text-sm font-medium transition-all",
            activeTab === "chats" 
              ? "bg-neon-purple/20 text-white neon-border" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          Chats
        </button>
        <button 
          onClick={() => setActiveTab("calls")}
          className={cn(
            "flex-1 p-2 rounded-lg text-center text-sm font-medium transition-all",
            activeTab === "calls" 
              ? "bg-neon-purple/20 text-white neon-border" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          Calls
        </button>
        <button 
          onClick={() => setActiveTab("media")}
          className={cn(
            "flex-1 p-2 rounded-lg text-center text-sm font-medium transition-all",
            activeTab === "media" 
              ? "bg-neon-purple/20 text-white neon-border" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          Media
        </button>
      </div>
      
      <div className="p-3">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Search contacts..."
            className="w-full p-2 pl-9 rounded-lg bg-white/5 border border-white/10 text-white/80 focus:outline-none focus:ring-1 focus:ring-neon-blue/30"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {user && (
            <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 text-white/60 hover:text-neon-blue hover:bg-white/5"
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                  <DialogDescription>
                    Enter the email or user ID of the person you want to add.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onAddContact)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="userIdOrEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or User ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@email.com"
                              {...field}
                              className="bg-cyber-dark/50 border-white/20 focus:border-neon-blue"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingContact(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Contact
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {user ? (
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {loadingContacts ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 text-neon-blue animate-spin" />
            </div>
          ) : contacts.length > 0 ? (
            contacts.map(contact => (
              <div 
                key={contact.id} 
                className="px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div className="relative">
                  <Avatar 
                    src={contact.avatar_url || `https://i.pravatar.cc/150?u=${contact.contact_user_id}`} 
                    fallback={contact.username?.substring(0, 2)?.toUpperCase() || "U"} 
                    online={contact.status === "online"} 
                    away={contact.status === "away"} 
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{contact.username}</p>
                    <span className="text-xs text-white/40">
                      {Math.floor(Math.random() * 12) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60 truncate w-40">
                      {["Hey there!", "What's up?", "How are you?", "Got a minute?", "Check this out"][Math.floor(Math.random() * 5)]}
                    </p>
                    {Math.random() > 0.7 && (
                      <div className="w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center">
                        <span className="text-xs text-cyber-dark font-medium">{Math.floor(Math.random() * 5) + 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
              <UserPlus className="h-8 w-8 text-white/40 mb-2" />
              <p className="text-white/60">No contacts yet</p>
              <p className="text-xs text-white/40 mt-1">Click the + icon to add contacts</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <CircleUser className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/50 mb-4">Sign in to see your contacts</p>
            <Link to="/auth">
              <Button variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <div className="p-3 border-t border-white/10 flex justify-around">
        <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-neon-blue">
          <MessageCircle className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-neon-green">
          <Phone className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-neon-purple">
          <Video className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-neon-pink">
          <CircleUser className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
