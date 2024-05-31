"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";


export const supabaseServer = () => {
  const cookieStore = cookies();

  /* additionally configures a cookie store.
  This is because server-side environments need to handle cookies explicitly,
   while in the browser, cookies are handled automatically by the browser itself.

   */

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      //The cookies object is used to get and set cookies in the server-side environment
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};
