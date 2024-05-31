import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { useMessage } from "@/lib/store/messages";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { supabaseServer } from "@/lib/supabase/server";
import React, { useRef } from "react";
import { toast } from "sonner";
import { text } from "stream/consumers";
import { Imessage } from '../lib/store/messages';



/**
 * Renders a delete alert component.
 */
export function DeleteAlert() {
  const actionMessage = useMessage((state) => state.actionMessage);

  // optimising the delete of msgs
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  );

  /**
   * Handles the deletion of a message.
   */
  const handleDeleteMessage = async () => {
    const supabase = supabaseBrowser();

    console.log(
      "Last deleted message's Id was: ",
      actionMessage?.id!,
      "deleted by ",
      actionMessage?.users?.display_name
    );
    optimisticDeleteMessage(actionMessage?.id!);
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully deleted a message");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage} onKeyDown={(e) => {
            if (e.key == 'Enter') {
              handleDeleteMessage()
            }
          }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export function EditAlert() {

  // getting the message that is being edited
  const actionMessage = useMessage((state) => state.actionMessage);

  // optimising the edit of msgs
  const {optimisticEditMessage} = useMessage(
    (state) => state
  );


  // takig the reference of the input field to get the updated value
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    // 
  const handleEdit = async () => {

    // getting the supabase instance of the browser
    const supabase = supabaseBrowser();
    const text = inputRef.current.value.trim();
    if (text) {

      // whenever update occurs, reflects the update in the UI right away
      optimisticEditMessage({
        ...actionMessage,
        text,
        is_edit: true,
      } as Imessage);



      const { error } = await supabase
        .from("messages")
        .update({ text, is_edit: true })
        .eq("id", actionMessage?.id!);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Update Successfully");
      }
      // closing the dialog after editing
      document.getElementById("trigger-edit")?.click();
    } else {
      // if the input field is empty, then show the delete dialouge box
      document.getElementById("trigger-edit")?.click();
      document.getElementById("trigger-delete")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Input defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" onClick={handleEdit} >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}





