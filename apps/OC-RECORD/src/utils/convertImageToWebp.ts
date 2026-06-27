// canvas Web API를 사용하여 이미지를 webp 형식으로 반환 후 File로 반환합니다.

export async function convertImageToWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/webp") return file;
  if (file.type === "image/gif") return file;

  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.8);
    });

    if (!blob) return file;

    const webpName = file.name.match(/\.[^.]*$/)
      ? file.name.replace(/\.[^.]+$/, ".webp")
      : file.name + ".webp";

    return new File([blob], webpName, {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}
