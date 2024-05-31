import { User } from "@supabase/supabase-js";
import { create } from "zustand";

// here we know that how the "User" looks like from the supabase 
interface userState {
  // user:User  | null
  user:User | undefined
}

export const useUser = create<userState>()((set) => ({
  // user: null,
  user: undefined,
  
}));
