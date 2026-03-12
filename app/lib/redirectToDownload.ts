import { useRouter } from "next/navigation";

export function redirectToDownload(
  filename: string,
  fileId: string,
  mimeType: string = "application/pdf",
) {
  const router = useRouter();

  // Store file metadata in sessionStorage for download page
  sessionStorage.setItem(
    `file-${fileId}`,
    JSON.stringify({
      filename,
      mimeType,
      timestamp: Date.now(),
    }),
  );

  // Navigate to download page
  router.push(`/download/${fileId}`);
}

export function useDownloadRedirect() {
  const router = useRouter();

  return (
    filename: string,
    fileId: string,
    mimeType: string = "application/pdf",
  ) => {
    sessionStorage.setItem(
      `file-${fileId}`,
      JSON.stringify({
        filename,
        mimeType,
        timestamp: Date.now(),
      }),
    );
    router.push(`/download/${fileId}`);
  };
}
