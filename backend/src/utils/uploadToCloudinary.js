import cloudinary from '../config/cloudinary.js';

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - The file buffer from multer (req.file.buffer)
 * @param {string} folder - The folder name in Cloudinary (e.g. 'customers', 'products')
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadBufferToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        // Safety check: Ensure Cloudinary is configured
        if (!cloudinary.config().cloud_name) {
            return reject(new Error('Cloudinary not configured. Cannot upload image.'));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        uploadStream.end(buffer);
    });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId) => {
    // Safety check: Ensure Cloudinary is configured
    if (!cloudinary.config().cloud_name) {
        throw new Error('Cloudinary not configured. Cannot delete image.');
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};
