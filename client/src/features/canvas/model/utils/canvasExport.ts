/**
 * Downloads canvas content as an image file
 * @param canvas - HTML canvas element to export
 * @param filename - Name of the downloaded file (default: 'canvas-drawing.png')
 */
export const downloadCanvas = (canvas: HTMLCanvasElement, filename = 'canvas-drawing.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Copies canvas content to the system clipboard
 * @param canvas - HTML canvas element to copy
 * @returns Promise that resolves when copying is complete
 */
export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }

      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

/**
 * Exports canvas content in different image formats
 * @param canvas - HTML canvas element to export
 * @param format - Image format: 'png', 'jpeg', or 'webp' (default: 'png')
 * @param quality - Image quality for lossy formats (0-1, default: 0.92)
 * @returns Base64 encoded data URL of the exported image
 */
export const exportCanvas = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.92,
) => {
  const mimeType = `image/${format}`;
  return canvas.toDataURL(mimeType, quality);
};
