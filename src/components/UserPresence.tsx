"use client";

import { useUser } from '@/lib/store/user';
import { supabaseBrowser } from '@/lib/supabase/browser';
import React, { useEffect, useState } from 'react'

const UserPresence = () => {
    const user = useUser((state) => state.user);
    const [onlineUsers, setOnlineUsers] = useState(0)
    const supabase = supabaseBrowser();

    useEffect(() => {   
        const roomOne = supabase.channel("room_01");

        roomOne
          .on("presence", { event: "sync" }, () => {
            const userIds=[];
            for(const Id in roomOne.presenceState()){
              // @ts-ignore
              userIds.push(roomOne.presenceState()[Id][0].user_id);
            }
            // console.log(userIds)
            // setOnlineUsers([...Set(userIds)].length)
            setOnlineUsers(userIds.length)
          })
          .on("presence", { event: "join" }, ({ key, newPresences }) => {
            console.log("join", key, newPresences);
          })
          .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
            console.log("leave", key, leftPresences);
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await roomOne.track({
                online_at: new Date().toISOString(),
                user_id: user?.id,
              });
            }
          });

    },[user,supabase]);

    if(!user){
        return <div className="h-3 w-1"></div>
    }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
    </div>
  );
}

export default UserPresence