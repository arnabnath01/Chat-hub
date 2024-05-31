"use client";

import  { useEffect, useRef } from "react";
import { Imessage, useMessage } from "./messages";

export default function InitMessages({ messages }: { messages: Imessage[] }) {
  const init = useRef(false);

  useEffect(() => {
    if (!init.current) {
      useMessage.setState({ messages });
    }

    init.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
