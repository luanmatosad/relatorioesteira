export async function refreshReport() {
  const response = await fetch("/api/report/refresh", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("refresh_failed");
  }

  return response.json() as Promise<{ success: boolean; lastSyncAt: string }>;
}
