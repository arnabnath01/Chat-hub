"use client";

import React, { useEffect, useRef } from 'react'
import {useUser} from './user'
import { User } from '@supabase/supabase-js'

// export default function InitUser ({user}: {user: User | null}) {
export default function InitUser ({user}: {user: User | undefined}) {

    const init = useRef(false);

    useEffect(() => {
      if(!init.current) {
        useUser.setState({user})
      }
    
      init.current = true
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
  return null
  
}