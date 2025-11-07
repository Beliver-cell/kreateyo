const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload file to Cloudinary
exports.uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'nexuscreate',
        resource_type: options.resourceType || 'auto',
        public_id: options.publicId,
        overwrite: options.overwrite !== false,
        transformation: options.transformation
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete file from Cloudinary
exports.deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

// Get optimized image URL
exports.getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    quality: options.quality || 'auto',
    fetch_format: 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    ...options
  });
};

module.exports = cloudinary;
