import React, { Suspense } from 'react'
import ListMessages from './ListMessages'

import InitMessages from '@/lib/store/initmessages';
import { supabaseServer } from '@/lib/supabase/server';
import { LIMIT_MESSAGES } from '@/lib/constant';
// import DeleteAlert from "./MessageActions";

export default async function ChatMessages() {


  const supabase = await supabaseServer();

  // console.log(supabase)
  const { data } = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGES)
    .order("created_at", { ascending: false });

  // console.log(data?.length);

  

  return (
    // suspense is used to handle async data
    <Suspense fallback={"loading.."}>
      {/* lists all the messages  */}
      <ListMessages />

      {/* data can be empty */}
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}