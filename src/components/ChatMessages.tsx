import React, { Suspense } from 'react'
import ListMessages from './ListMessages'

import InitMessages from '@/lib/store/initmessages';
import { supabaseServer } from '@/lib/supabase/server';
import DeleteAlert from "./MessageActions";

export default async function ChatMessages() {
  // const msgData = supabaseServer();

  // const { data } = await msgData
  //   .from("messages")
  //   .select("*,users(*)")
  //   .order("created_at", { ascending: false });

  // console.log(data)

  const supabase = await supabaseServer();

  // console.log(supabase)
  const { data } = await supabase.from("messages").select("*,users(*)");

  console.log(data?.length);

  // console.log(data[0])

  return (
    // suspense is used to handle async data
    <Suspense fallback={"loading.."}>
      {/* lists all the messages  */}
      <ListMessages />

      {/* data can be empty */}
      <InitMessages messages={data || []} />
    </Suspense>
  );
}