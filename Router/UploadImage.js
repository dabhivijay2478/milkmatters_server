const express = require("express");
const dotenv = require("dotenv");

const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require("mongoose");

const router = express.Router();
dotenv.config({ path: "../.env" });


// const mongouri = process.env.DATABASE;
const mongouri = "mongodb://0.0.0.0:27017/milkmatters"
console.log(mongouri);
try {
    mongoose.connect(mongouri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
} catch (error) {
    handleError(error);
}

process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error.message);
});

let bucket; // Add this line to initialize the bucket variable

mongoose.connection.on("connected", () => {
    const client = mongoose.connections[0].client;
    const db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "photos", // Change the bucketName to 'photos'
    });
    console.log(bucket);
});

const storage = new GridFsStorage({
    url: mongouri, // Add the MongoDB connection URL
    file: (req, file) => {
        if (file.mimetype === 'image/jpeg') {
            return {
                bucketName: 'photos' // Change the bucketName to 'photos'
            };
        } else {
            return null;
        }
    }
});
const upload = multer({ storage });

// Route to get all images (same as before)

router.get("/getImages", async (req, res) => {
    try {
        const files = await bucket.find({ contentType: { $regex: /^image/ } }).toArray();
        const imageArray = [];

        files.forEach((file) => {
            imageArray.push({
                filename: file.filename,
                contentType: file.contentType,
                uploadDate: file.uploadDate,
            });
        });

        return res.status(200).json(imageArray);
    } catch (error) {
        console.error("Error fetching image files:", error);
        return res.status(500).json({
            message: "Error fetching image files",
            error: error.message,
        });
    }
});


// Route to upload images (same as before)

router.post("/upload", upload.array("photos"), (req, res) => {
    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images were uploaded" });
    }

    // If files were uploaded, gather the file information
    const fileInformation = req.files.map((file) => ({
        filename: file.filename,
    }));

    // Send the file information back as a response
    res.status(200).json({ files: fileInformation });
});


// Route to get a specific image by its filename (same as before)

router.get("/getImage/:filename", (req, res) => {
    const filename = req.params.filename;

    const downloadStream = bucket.openDownloadStreamByName(filename);

    res.set("Content-Type", "image/jpeg");

    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
        res.status(404).send("Image not found");
    });
});

//update Image


router.put("/updateImage/:filename", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const filename = req.params.filename;

        // Check if the image with the specified filename exists
        const existingFile = await bucket.find({ filename }).toArray();

        if (existingFile.length === 0) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Delete the old image with the same filename
        await bucket.delete(existingFile[0]._id);

        // Create a new GridFS file with the updated image data and the same filename
        const writeStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
        });

        res.status(200).json({ message: `Image updated successfully with filename: ${req.file.filename}`, productImage: req.file.filename });


    } catch (error) {
        console.error("Error updating image:", error);
        return res.status(500).json({
            message: "Error updating image",
            error: error.message,
        });
    }
});



module.exports = router;
