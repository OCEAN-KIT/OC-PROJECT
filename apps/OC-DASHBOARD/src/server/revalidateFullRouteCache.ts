"use server";

import { revalidatePath } from "next/cache";

export async function revalidateFullRouteCache(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Invalid revalidate path: ${path}`);
  }

  revalidatePath(path);
}
