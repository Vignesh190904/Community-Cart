import multer from 'multer';

// Use memory storage so we can upload buffer to Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter,
});

/**
 * Middleware for single image upload
 * @param {string} fieldName - Form field name (e.g. 'avatar')
 */
export const uploadSingleImage = (fieldName) => {
    return upload.single(fieldName);
};

/**
 * Middleware for multiple image uploads
 * @param {string} fieldName - Form field name (e.g. 'images')
 * @param {number} maxCount - Max number of files
 */
export const uploadMultipleImages = (fieldName, maxCount) => {
    return upload.array(fieldName, maxCount);
};
