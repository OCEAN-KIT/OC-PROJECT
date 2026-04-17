// ex) src/utils/url.ts
export const FILE_BASE =
  process.env.NEXT_PUBLIC_API_FILE_BASE || "http://localhost:8080";

export function toFileURL(path: string | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // 이미 절대 URL
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${FILE_BASE}/${clean}`; // BASE + 상대경로
}
