type PhotoGalleryProps = {
  photos: string[]
  onOpen: (index: number) => void
}

export function PhotoGallery({ photos, onOpen }: PhotoGalleryProps) {
  if (photos.length === 0) return null

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        첨부 사진
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((src, index) => (
          <button
            key={src}
            type="button"
            className="relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg ring-1 ring-gray-200 transition-shadow hover:ring-2 hover:ring-blue-400"
            onClick={() => onOpen(index)}
          >
            <img
              src={src}
              alt={`photo-${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
