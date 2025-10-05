"use client";

import { useState } from "react";
import { uploadImage } from "@/api/upload-image";
import Image from "next/image";

export default function ImageUploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultKey, setResultKey] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResultKey(null);
    try {
      const key = await uploadImage(file); // 문자열 반환
      setResultKey(key); // 바로 문자열로 저장
    } catch (e) {
      console.error(e);
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <input type="file" accept="image/*" onChange={onChange} />

      {preview && (
        <Image
          src={preview}
          width={300}
          height={300}
          alt="preview"
          className="rounded border"
        />
      )}

      <button
        disabled={!file || uploading}
        onClick={onUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {uploading ? "업로드 중…" : "업로드"}
      </button>

      {resultKey && (
        <div className="text-sm mt-2">
          <div className="text-green-600">업로드 성공</div>
          <div>
            S3 Key: <span className="break-all">{resultKey}</span>
          </div>
        </div>
      )}
    </div>
  );
}
