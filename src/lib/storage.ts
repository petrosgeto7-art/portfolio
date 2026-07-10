// Replaced Firebase storage with simple URL input
export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
  // In a real Vercel app without a storage provider, we can't save files locally.
  // We'll return a placeholder or ask the user to provide a URL instead.
  alert("File uploading is disabled in this MongoDB/Vercel setup. Please provide an Image URL directly in the text field.");
  throw new Error("File upload not supported without a storage provider (like Cloudinary/S3).");
}
