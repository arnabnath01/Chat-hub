"use client";

import  { useEffect, useRef } from "react";
import { Imessage, useMessage } from "./messages";
import { LIMIT_MESSAGES } from "../constant";

export default function InitMessages({ messages }: { messages: Imessage[] }) {
  const init = useRef(false);
  const hasMore =  messages.length-LIMIT_MESSAGES>=0
  useEffect(() => {
    if (!init.current) {
      useMessage.setState({ messages,hasMore });
    }

    init.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
