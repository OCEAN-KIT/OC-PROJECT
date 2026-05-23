export function extractFilename(header?: string | null) {
  if (!header) return undefined

  const matched =
    /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header) ??
    /filename=(.+)$/.exec(header)

  if (!matched) return undefined

  const filename = matched[1].replace(/"/g, '')

  try {
    return decodeURIComponent(filename)
  } catch {
    return filename
  }
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
