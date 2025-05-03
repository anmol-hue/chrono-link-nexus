
import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const userSettingsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  themeColor: z.enum(["blue", "purple", "green", "pink"]),
  notificationSound: z.boolean(),
  messagePreview: z.boolean(),
  messageEffect: z.enum(["none", "fade", "slide", "bounce"]),
  compactMode: z.boolean(),
});

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ open, onOpenChange }) => {
  const { user, updateUserSettings, userSettings } = useAuth();
  
  const form = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      themeColor: (userSettings?.themeColor as "blue" | "purple" | "green" | "pink") || "blue",
      notificationSound: userSettings?.notificationSound !== false,
      messagePreview: userSettings?.messagePreview !== false,
      messageEffect: (userSettings?.messageEffect as "none" | "fade" | "slide" | "bounce") || "fade",
      compactMode: userSettings?.compactMode === true,
    },
  });
  
  const onSubmit = async (values: UserSettingsFormValues) => {
    try {
      await updateUserSettings(values);
      toast.success("Settings updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-cyber-dark border-neon-blue/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            User Settings
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Customize your ChronoLink experience
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
        </DialogClose>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            
              <TabsContent value="profile" className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your username" 
                          className="bg-cyber-light/30 border-white/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            
              <TabsContent value="appearance" className="space-y-4">
                <FormField
                  control={form.control}
                  name="themeColor"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Theme Color</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="blue" 
                              id="blue"
                              className="border-neon-blue bg-neon-blue/20" 
                            />
                            <Label htmlFor="blue" className="text-neon-blue">Blue</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="purple" 
                              id="purple" 
                              className="border-neon-purple bg-neon-purple/20"
                            />
                            <Label htmlFor="purple" className="text-neon-purple">Purple</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="green" 
                              id="green"
                              className="border-neon-green bg-neon-green/20" 
                            />
                            <Label htmlFor="green" className="text-neon-green">Green</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="pink" 
                              id="pink"
                              className="border-neon-pink bg-neon-pink/20" 
                            />
                            <Label htmlFor="pink" className="text-neon-pink">Pink</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="messageEffect"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Message Animation</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none">None</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fade" id="fade" />
                            <Label htmlFor="fade">Fade</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="slide" id="slide" />
                            <Label htmlFor="slide">Slide</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bounce" id="bounce" />
                            <Label htmlFor="bounce">Bounce</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="compactMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Compact Mode</FormLabel>
                        <FormDescription className="text-xs text-white/50">
                          Display more information in less space
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            
              <TabsContent value="notifications" className="space-y-4">
                <FormField
                  control={form.control}
                  name="notificationSound"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Notification Sound</FormLabel>
                        <FormDescription className="text-xs text-white/50">
                          Play sound when receiving new messages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="messagePreview"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Message Previews</FormLabel>
                        <FormDescription className="text-xs text-white/50">
                          Show message content in notifications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="submit" className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/40">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
