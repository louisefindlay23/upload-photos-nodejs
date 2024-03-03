// Server Modules
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = process.env.PORT;

// Photo Uploading Modules
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

// Initalise MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});
const collection = client.db("photo-uploading").collection("photos");

// Initialising Express
app.use(express.static("public"));
app.set("view engine", "ejs");

// Run server
app.listen(port);
console.info("Listening on " + port);

// Create uploads folder if it doesn't exist
fs.access("public/img/uploads", (err) => {
  if (err) {
    fs.mkdir("public/img/uploads", (err) => {
      if (err) throw err;
    });
  }
});

// Multer DiskStorage - for storing images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/uploads");
  },
  filename: function (req, file, cb) {
    let a = Math.floor(Math.random() * 1001);
    cb(null, file.fieldname + "-" + a + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Root Route
app.get("/", async function (req, res) {
  await getPhotos()
    .then((photos) => {
      res.render("pages/index", {
        photos: photos,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("pages/index", {
        photos: null,
      });
    });
});

async function getPhotos() {
  try {
    await client.connect();
    const photos = await collection.find().toArray();
    return photos;
  } finally {
    await client.close();
  }
}

// Upload Photo Route
app.post(
  "/upload-photo",
  upload.single("photo"),
  async function (req, res, next) {
    const photoFile = req.file;

    // Resize image
    sharp(req.file.path)
      .resize(300)
      .toBuffer(function (err, buffer) {
        if (err) throw err;
        fs.writeFile(req.file.path, buffer, function (e) {});
      });

    await savePhoto(photoFile)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/");
      });
  }
);

// Save Photo File Details to DB
async function savePhoto(photoFile) {
  try {
    await client.connect();
    const insertPhoto = await collection.insertOne(photoFile);
  } finally {
    await client.close();
  }
}
