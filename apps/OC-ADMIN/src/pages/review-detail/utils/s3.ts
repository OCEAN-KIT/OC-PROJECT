export function keyToPublicUrl(key: string) {
  const rawKey = String(key || '')

  if (!rawKey) return ''
  if (/^https?:\/\//i.test(rawKey)) return rawKey

  const base = (process.env.NEXT_PUBLIC_S3_PUBLIC_BASE || '').replace(
    /\/+$/,
    '',
  )
  const cleanKey = rawKey.replace(/^\/+/, '')

  return base ? `${base}/${cleanKey}` : `/${cleanKey}`
}
