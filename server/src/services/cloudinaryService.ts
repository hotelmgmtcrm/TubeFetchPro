import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string, publicId: string, resourceType: 'video' | 'raw' | 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType === 'raw' ? 'auto' : resourceType, // Use 'auto' for mp3/raw
      folder: 'tubefetchpro',
    });

    // Cleanup local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
    };
  } catch (error: any) {
    console.error(`[ERROR] Cloudinary upload failed: ${error.message}`);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
