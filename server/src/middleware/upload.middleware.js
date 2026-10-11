const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .jpg, .jpeg, .png, .webp images are accepted"));
  },
});

function single(fieldName) {
  return (req, res, next) => {
    parser.single(fieldName)(req, res, (parseError) => {
      if (parseError) return next(parseError);
      if (!req.file) return next();

      const hasCloudinaryCredentials =
        process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET);

      if (!hasCloudinaryCredentials) {
        const error = new Error("Image uploads require Cloudinary configuration.");
        error.status = 503;
        return next(error);
      }

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      }

      cloudinary.uploader
        .upload_stream(
          { folder: "campus-lost-and-found", resource_type: "image" },
          (uploadError, result) => {
            if (uploadError || !result) {
              return next(uploadError || new Error("Cloudinary did not return an uploaded image."));
            }

            req.file.path = result.secure_url;
            req.file.filename = result.public_id;
            next();
          }
        )
        .end(req.file.buffer);
    });
  };
}

module.exports = { single };