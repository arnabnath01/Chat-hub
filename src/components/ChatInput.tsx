"use client";

import React, { useOptimistic } from 'react'
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import { useUser } from '@/lib/store/user';
import { v4 as uuidv4 } from "uuid";
import { Imessage, useMessage } from '@/lib/store/messages';


export default  function ChatInput(){


    // this is the destructured way of getting the user from the store
    const {user} = useUser((state)=>state)
    
        // this line uses  selector function to get the user from the store
// const user = useUser((state)=>state.user)


   const addMessage= useMessage((state)=>state.addMessage)

   const setOptimisticId= useMessage((state)=>state.setOptimisticId)
    // here we r getting the client instance; syncronously
    const supabase = supabaseBrowser();


    const sendMessage = async (text:string) => {

        if(text.trim() === '') return toast.error("message can not be empty")
        const newMesaage = {
            id:uuidv4(),
            text,
            created_at: new Date().toISOString(),
            is_edit:false,
            send_by:user?.id,
            users:{
                id:user?.id,
                avatar_url:user?.user_metadata.avatar_url,
                created_at:new Date().toISOString(),
                display_name:user?.user_metadata.display_name
            },
        }



        addMessage(newMesaage as Imessage);
        setOptimisticId(newMesaage.id);

    // call supabase function to send message
    const {error} =await supabase.from('messages').insert({text})

    if(error){
        toast.error(error.message)
    }
    }
  return (
    <div>
       
        <div className="p-5 text-gray-600">
            <Input type="text" placeholder="enter msg" 
            onKeyDown={(e)=>{
                if(e.key=='Enter'){
                    sendMessage(e.currentTarget.value)
                    e.currentTarget.value=''
                }
            }}
            />
        </div>
    </div>
  )
}
