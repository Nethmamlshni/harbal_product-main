import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({ storage });

export const uploadSingle = upload.single('featuredImage');
export const uploadMultiple = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'imageGallery', maxCount: 10 },
]);