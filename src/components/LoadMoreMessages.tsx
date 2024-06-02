
import React from 'react'
import { Button } from './ui/button'
import { supabaseBrowser } from '@/lib/supabase/browser';
import { LIMIT_MESSAGES } from '@/lib/constant';
import { getFromAndTo } from '@/lib/utils';
import { useMessage } from '@/lib/store/messages';
import { toast } from 'sonner';

const LoadMoreMessages = () => {
    
    const { page } = useMessage((state) => state);

    // pagination
     const setMsgs = useMessage((state) => state.setMsgs);
     const hasMore = useMessage((state) => state.hasMore);
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGES);
    // fetches more data from the database
    const fetchMore = async ()=>{

        const supabase = await supabaseBrowser();

        const { data,error } = await supabase
          .from("messages")
          .select("*,users(*)")
          .range(from, to)
          .order("created_at", { ascending: false });
          if(error){
            toast.error(error.message)
          }
          else{
            setMsgs(data)
            // console.log(data)
          
          }
    }

 
    if(hasMore){
         return (
         <Button variant={'outline'} className='w-full' onClick={fetchMore}>Load more.</Button>
         )
    }
    else return <></>;
   
  
}

export default LoadMoreMessages