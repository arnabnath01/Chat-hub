import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useMessage } from "./store/messages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// this is to generate from and to for pagination
export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;
  let to = from + itemPerPage;

  // avoid repeating the last item
  if (page > 0) {
    from += 1;
  }
  return { from, to };
}
