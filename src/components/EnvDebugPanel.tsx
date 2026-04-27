import { ENABLE_REAL_SEARCH } from "@/lib/flags";

export const EnvDebugPanel = () => {
  const realSearchRaw = import.meta.env.VITE_ENABLE_REAL_SEARCH;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fmt = (v: unknown) =>
    v === undefined ? "undefined" : v === "" ? '""' : String(v);

  return (
    <div
      style={{ position: "fixed", bottom: 10, right: 10, zIndex: 9999 }}
      className="max-w-[320px] rounded-md border border-border bg-background/95 p-2 font-mono text-[10px] leading-tight text-foreground shadow-md backdrop-blur"
      data-testid="env-debug-panel"
    >
      <div className="mb-1 font-semibold">ENV DEBUG:</div>
      <div>realSearchRaw: {fmt(realSearchRaw)}</div>
      <div className="break-all">apiBaseUrl: {fmt(apiBaseUrl)}</div>
      <div>enabledComputed: {String(ENABLE_REAL_SEARCH)}</div>
    </div>
  );
};
