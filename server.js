// Server Modules
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = process.env.PORT;
require("dotenv").config();

// Photo Uploading Modules
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

// Initalise MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// Initialising Express
app.use(express.static("public"));
app.set("view engine", "ejs");

// Run server
app.listen(process.env.PORT);
console.log("Listening on " + process.env.PORT);

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
app.get("/", function (req, res) {
    client.connect((err) => {
        const collection = client.db("photo-uploading").collection("photos");
        const retrievePhotos = async () => {
            const getPhotos = collection.find({});
            await getPhotos.toArray().then((photos) => {
                console.info(photos);
                res.render("pages/index", {
                    photos: photos,
                });
            });
            client.close();
        };
        retrievePhotos();
    });
});

// Upload Photo Route
app.post("/upload-photo", upload.single("photo"), function (req, res, next) {
    const photofile = req.file;

    // Resize image
    sharp(req.file.path)
        .resize(300)
        .toBuffer(function (err, buffer) {
            if (err) throw err;
            fs.writeFile(req.file.path, buffer, function (e) {});
        });

    // Save Photo File Details to DB
    client.connect((err) => {
        const collection = client.db("photo-uploading").collection("photos");
        const uploadPhoto = async () => {
            const insertPhoto = await collection.insertOne(photofile);
            console.info(insertPhoto);
            client.close();
        };
        uploadPhoto();
    });
    res.redirect("/");
});
