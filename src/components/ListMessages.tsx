"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import { useEffect, useRef, useState } from "react";
import Message from './Message';
import {DeleteAlert, EditAlert} from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { MoveDown } from "lucide-react";

export default function ListMessages() {
  const { messages,addMessage,optimisticDeleteMessage,optimisticEditMessage} = useMessage((state) => state);


  const [userScrolled,setUserScrolled ] =useState(false);
 	const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const supabase = supabaseBrowser();

  useEffect(() => {

    // adding supabase realtime here
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          console.log("change aa gya :", payload.commit_timestamp);

          // fetching the user data of the message sender
          const { error, data } = await supabase
            .from("users")
            .select("*")
            .eq("id", payload.new.send_by)
            .single(); // single is used because only one user data is needed, its like limit 1 in sql

          if (error) {
            toast.error("Error fetching user data");
          } else {
            // the user data is also inserted into the message object to avoid multiple queries
            const newMessage = {
              ...payload.new,
              users: data,
            };
            addMessage(newMessage as Imessage);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
           console.log(payload);
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log(payload)
          optimisticEditMessage(payload.new as Imessage);
        }
      )
      .subscribe();


      return () => {
        channel.unsubscribe();
      } 
  }, []);

	useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  

  

  // tells about clients position
  const handleScroll = ()=>{
    const scrollContalner = scrollRef.current;
    if(scrollContalner){
      const isScroll = scrollContalner.scrollTop<(scrollContalner.scrollHeight-scrollContalner.clientHeight-10)

      setUserScrolled(isScroll)
     
    }
  }


  // click arrow to go down , till last chat
const scrollDown  = ()=>
{  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

}
  return (
    <>
      <div
        className="flex-1 flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="flex-1"></div>
        <div className="space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value} />;
          })}
        </div>
      </div>

      <div className="absolute w-full bottom-20 ">
        {
          userScrolled && (
            <div className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
            onClick={
              scrollDown
            }
            >
          <MoveDown />
        </div>
          )
        }
        
      </div>
      <DeleteAlert />
      <EditAlert />
    </>
  );
}



