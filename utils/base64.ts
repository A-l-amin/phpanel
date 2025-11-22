/**
 * Converts a File or Blob object to a Base64 encoded string.
 * @param file The File or Blob to convert.
 * @returns A Promise that resolves with the Base64 string (including data URL prefix).
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Extracts the Base64 data part from a data URL string.
 * E.g., "data:image/png;base64,iVBORw..." -> "iVBORw..."
 * @param dataUrl The data URL string.
 * @returns The Base64 data part.
 */
export const extractBase64Data = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  return dataUrl;
};

/**
 * Extracts the MIME type from a data URL string.
 * E.g., "data:image/png;base64,iVBORw..." -> "image/png"
 * @param dataUrl The data URL string.
 * @returns The MIME type string.
 */
export const extractMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  if (match && match[1]) {
    return match[1];
  }
  return '';
};
