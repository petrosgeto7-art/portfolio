import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import imageCompression from 'browser-image-compression';

/**
 * Compress an image file and upload it to Firebase Storage.
 * Returns the public download URL (not a base64 string).
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = 'images'
): Promise<string> {
  // Compress the image first
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);

  // Create a unique filename
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

  // Upload to Firebase Storage
  await uploadBytes(storageRef, compressedFile);

  // Get the public download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
