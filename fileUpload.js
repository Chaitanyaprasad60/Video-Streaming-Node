
const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'videos/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      req.body.fileName = uniqueSuffix;
      cb(null, uniqueSuffix + '.mp4');
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;