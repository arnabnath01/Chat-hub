import { create } from "zustand";
import Message from '../../components/Message';
import { stat } from "fs";
import { LIMIT_MESSAGES } from "../constant";

// Define the structure of a message
export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string | null;
    created_at: string | null;
    display_name: string | null;
    id: string;
  } | null;
};

// Define the state structure for messages
interface messageState {
  hasMore:boolean;
  page: number; // Page number for pagination
  messages: Imessage[]; // Array of messages
  actionMessage : Imessage | undefined; // Message that is currently being acted upon (edit/delete)
  addMessage: (message:Imessage) => void; // Function to add a message
  setActionMessage:(message:Imessage)=>void; // Function to set the action message
  optimisticId: string[] ; // Id of the message that is currently being acted upon (edit/delete)
  optimisticDeleteMessage:(messageId: string)=>void; // Function to delete a message optimistically
  optimisticEditMessage:(message:Imessage)=>void; // Function to edit a message optimistically
  setOptimisticId:(Id:string)=>void;
  setMsgs:(messsages:Imessage[])=>void;
}

// Create a Zustand store for messages
export const useMessage = create<messageState>()((set) => ({
  hasMore:true,
  page: 1, // Initial state for page
  messages: [], // Initial state for messages
  actionMessage: undefined, // Initial state for action message
  setMsgs:(messages)=>{
  set((state) => ({
    // Add a new message to the existing messages
    messages: [...state.messages, ...messages],
    page: state.page + 1,
    hasMore : messages.length >= LIMIT_MESSAGES ,
  }));
  },
  addMessage: (newMessage) => {
    set((state) => ({
      // Add a new message to the existing messages
      messages: [...state.messages, newMessage],
    }));
  },
  
  optimisticId: [], // Initial state for optimistic id
  setOptimisticId: (Id: string) => {
    set((state)=>({
      optimisticId:[...state.optimisticId,Id]
    }))
  },
  setActionMessage: (message) => {
    set((state) => ({
      // Set the action message
      actionMessage: message,
    }));
  },

  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      // Delete a message from the messages array by filtering it out
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),

  optimisticEditMessage: (updateMessage) =>
    set((state) => {
      // Edit a message in the messages array by finding it by id and updating its text and is_edit properties
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            message.text = updateMessage.text;
            message.is_edit = true;
          }
          return message;
        }),
      };
    }),
}));