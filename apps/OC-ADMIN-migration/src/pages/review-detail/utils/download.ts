export function extractFilename(header?: string | null) {
  if (!header) return undefined

  const matched =
    /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header) ??
    /filename=(.+)$/.exec(header)

  return matched ? decodeURIComponent(matched[1].replace(/"/g, '')) : undefined
}

export function saveBlobAsFile(blob: Blob, suggestedName = 'download.bin') {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = suggestedName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
