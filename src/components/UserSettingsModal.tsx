
import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  themeColor: z.string(),
  notificationSound: z.boolean(),
  messagePreview: z.boolean(),
  messageEffect: z.string(),
  compactMode: z.boolean(),
});

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { userSettings, updateUserSettings } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeColor: userSettings.themeColor,
      notificationSound: userSettings.notificationSound,
      messagePreview: userSettings.messagePreview,
      messageEffect: userSettings.messageEffect,
      compactMode: userSettings.compactMode,
    },
  });

  // Update form when userSettings changes
  React.useEffect(() => {
    form.reset({
      themeColor: userSettings.themeColor,
      notificationSound: userSettings.notificationSound,
      messagePreview: userSettings.messagePreview,
      messageEffect: userSettings.messageEffect,
      compactMode: userSettings.compactMode,
    });
  }, [userSettings, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUserSettings(values);
      toast.success("Settings updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-cyber-light border border-neon-blue/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            <span className="bg-clip-text text-transparent bg-neon-glow">
              User Settings
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="themeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Color</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-neon-blue mr-2"></div>
                              Neon Blue
                            </div>
                          </SelectItem>
                          <SelectItem value="purple">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-neon-purple mr-2"></div>
                              Neon Purple
                            </div>
                          </SelectItem>
                          <SelectItem value="green">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-neon-green mr-2"></div>
                              Neon Green
                            </div>
                          </SelectItem>
                          <SelectItem value="pink">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-neon-pink mr-2"></div>
                              Neon Pink
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Choose the primary color for your interface
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationSound"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Notification Sounds</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable sounds for new messages and notifications
                      </p>
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
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Message Previews</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show message content in notifications
                      </p>
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
                name="messageEffect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Effects</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an effect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fade">Fade In</SelectItem>
                          <SelectItem value="slide">Slide In</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="none">No Animation</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Choose how messages appear in your chat
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compactMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Compact Mode</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact UI layout
                      </p>
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
