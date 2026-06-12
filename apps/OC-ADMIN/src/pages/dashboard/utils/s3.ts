export function keyToPublicUrl(key: string): string {
  const rawKey = String(key || '')

  if (!rawKey) return ''
  if (/^https?:\/\//i.test(rawKey)) return rawKey

  const base = (process.env.S3_PUBLIC_BASE || '').replace(/\/+$/, '')
  const cleanKey = rawKey.replace(/^\/+/, '')

  return base ? `${base}/${cleanKey}` : `/${cleanKey}`
}
