/**
 * Trigger a browser download for plain string content.
 */
export function triggerBrowserDownload(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Defer revocation so browsers like Safari have time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
