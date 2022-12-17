const express = require("express");
const multer = require("multer");
const path = require("path");
const csvtojson = require("csvtojson");
const checkAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
    
        if (ext !== ".csv") {
          return cb(new Error("Only csvs are allowed!"));
        }
    
        cb(null, true);
      },});
const router = express.Router();
const Contact = require("../models/contact");

router.post("/upload", checkAuth, upload.single("contacts"), (req, res, next) => {
    console.log(res.file);
    csvtojson()
    .fromFile(req.file.path)
    .then((csvData) => {
        // console.log(csvData);
        Contact.insertMany(csvData)
        .then(() => {
            console.log("Data inserted");
            res.status(200).json({
                message: "Data inserted",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
    // res.status(200).json({
    //     message: "Data inserted",
    //     file: req.file.path,
    // })
});

module.exports = router;