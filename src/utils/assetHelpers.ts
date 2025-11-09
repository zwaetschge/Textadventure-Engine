import { AssetFile } from '../types/nodes';

/**
 * Converts a File to a Base64 data URL
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Validates if a file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Validates file size (max 10MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Processes an uploaded image file
 */
export const processImageFile = async (file: File): Promise<AssetFile> => {
  if (!isImageFile(file)) {
    throw new Error('File must be an image');
  }
  if (!isValidFileSize(file)) {
    throw new Error('File size must be less than 10MB');
  }

  const url = await fileToBase64(file);
  return {
    url,
    name: file.name,
  };
};

/**
 * Processes an uploaded audio file
 */
export const processAudioFile = async (file: File): Promise<AssetFile> => {
  if (!isAudioFile(file)) {
    throw new Error('File must be an audio file');
  }
  if (!isValidFileSize(file, 20)) {  // Allow 20MB for audio
    throw new Error('File size must be less than 20MB');
  }

  const url = await fileToBase64(file);
  return {
    url,
    name: file.name,
  };
};

/**
 * Gets a unique ID for assets
 */
export const generateAssetId = (): string => {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
