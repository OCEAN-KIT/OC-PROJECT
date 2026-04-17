import {
  isAxiosError,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type Extra = Record<string, unknown> | undefined;

function safe(v: unknown) {
  try {
    return v; // 필요하면 JSON.stringify(v, null, 2)
  } catch {
    return v;
  }
}

/** 로그 남기고 동일 에러 throw (React Query로 전파) */
export function debugAxiosError(
  err: unknown,
  where: string,
  extra?: Extra
): never {
  if (isAxiosError(err)) {
    const axErr = err as AxiosError<unknown, unknown>;
    const cfg = axErr.config as
      | (InternalAxiosRequestConfig & { params?: unknown })
      | undefined;

    console.group(`[API ERROR] ${where}`);
    if (extra) console.log("extra:", safe(extra));
    console.log("message:", axErr.message, "code:", axErr.code);

    if (cfg) {
      const url = cfg.baseURL
        ? `${cfg.baseURL ?? ""}${cfg.url ?? ""}`
        : cfg.url;
      console.log("request.method:", cfg.method);
      console.log("request.url:", url);
      console.log("request.params:", safe(cfg.params));
      console.log("request.data:", safe(cfg.data));
      console.log("request.headers:", safe(cfg.headers));
    }

    if (axErr.response) {
      console.log("response.status:", axErr.response.status);
      console.log("response.statusText:", axErr.response.statusText);
      console.log("response.data:", safe(axErr.response.data));
      console.log("response.headers:", safe(axErr.response.headers));
    } else if (axErr.request) {
      console.log("no response (network/CORS). raw request:", axErr.request);
    }
    console.groupEnd();
  } else {
    console.group(`[ERROR] ${where}`);
    if (extra) console.log("extra:", safe(extra));
    console.error(err);
    console.groupEnd();
  }
  throw err;
}
