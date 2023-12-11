import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import fs from 'fs';

// use multer
const upload = multer({ dest: 'uploads/' });

// use env vars
dotenv.config();

// use express
const app = express();
// listen to 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// public folder
app.use(express.static("public"));

// use ejs
app.set("view engine", "ejs");



// s3 config
const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  },
});

// routes

// route: GET /
app.get("/", (req, res) => {
  res.render("index");
});

// route: POST /upload
app.post("/upload", upload.single('image'), async (req, res) => {
  console.log(req.file);
  const fileStream = fs.createReadStream(req.file.path);
  const stats = fs.statSync(req.file.path);
  const fileSize = stats.size;
  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: fileStream,
        ContentLength: fileSize,
      },
      queueSize: 4, // Number of concurrent uploads (optional, default is 4)
    });

    await upload.done(); // Waits for the upload to finish

    console.log(`File uploaded successfully.`);

    // Clean up: delete the temporary file after upload
    fs.unlinkSync(req.file.path);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file.");
  }

  res.redirect("/");
});
