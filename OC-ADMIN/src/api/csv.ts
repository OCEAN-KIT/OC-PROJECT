// src/api/exports.ts
import axiosInstance from "@/utils/axiosInstance";

/** 서버 스펙 기준 바디 */
type ExportBody = {
  format: "CSV";
  filters: {
    dateFrom: string; // "YYYY-MM-DD"
    dateTo: string; // "YYYY-MM-DD"
  };
};

function fallbackFilename({ dateFrom, dateTo }: ExportBody["filters"]) {
  const range = dateFrom === dateTo ? dateFrom : `${dateFrom}_to_${dateTo}`;
  return `submissions_${range}.csv`;
}

function extractFilename(header?: string | null) {
  if (!header) return undefined;
  // Content-Disposition: attachment; filename="export.csv"
  const m =
    /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header) ??
    /filename=(.+)$/.exec(header);
  return m ? decodeURIComponent(m[1].replace(/"/g, "")) : undefined;
}

/**
 * CSV 파일 다운로드
 * - 서버: POST /api/admin/exports/download
 * - 응답: 파일(blob)
 */
export async function csvExport(
  filters: ExportBody["filters"],
  filename?: string
) {
  const body: ExportBody = { format: "CSV", filters };

  const res = await axiosInstance.post("/api/admin/exports/download", body, {
    responseType: "blob",
    // (선택) CSV를 명시하고 싶다면:
    headers: { Accept: "text/csv,application/octet-stream" },
  });

  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });

  const headerName = (res.headers as Record<string, string | undefined>)[
    "content-disposition"
  ];
  const serverName = extractFilename(headerName);
  const finalName = filename || serverName || fallbackFilename(filters);

  // 클라이언트에서 다운로드 트리거
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
