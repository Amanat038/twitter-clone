
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1 // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("File type allowed are .jpeg, .png, .jpg"), false);
    }
  }
});

router.post("/uploadFile", upload.single('file'), function (req, res) {
  if (req.file) {
    res.json({ "fileName": req.file.filename });
  } else {
    res.status(400).json({ error: "File upload failed" });
  }
});

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(uploadDir, fileName);

  res.download(filePath, (error) => {
    if (error) {
      res.status(500).send({ message: "File cannot be downloaded: " + error });
    }
  });
}

router.get('/files/:filename', downloadFile);

module.exports = router;
