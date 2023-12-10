import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

// use multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
  console.log("Name: " + req.file.originalname);
  console.log(req.body);
  const file = req.file;
  const fileName = file.originalname;
  const fileContent = file.data;
  console.log("File Name: " + fileName);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: req.file.mimetype
  };


  try {
    const data = await s3.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully. URL: ${data.Location}`);
    // Save the URL in your database or use it as needed
  } catch (err) {
    console.error(err);
    // Handle upload error
  }

  res.redirect("/");
});
