const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../server/.env"),
});
const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product.js");
aws = require("aws-sdk");
multerS3 = require("multer-s3");

// AWS config

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "eu-central-1",
});

s3 = new aws.S3({ signatureVersion: "v4" });

var upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, file.originalname); //use Date.now() for unique file keys
    },
  }),
});

//=================================
//             Products
//=================================

// get signed URL

router.get("/sign-s3", (req, res) => {
  const s3 = new aws.S3({ signatureVersion: "v4" });
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }

    const returnData = {
      signedRequest: data,
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

//used by upload form
router.post("/uploadImage", auth, upload.array("file", 4), (req, res, next) => {
  return res.json({
    success: true,
    name: req.files[0].key,
    type: req.files[0].contentType,
    path: req.files[0].location,
    fileName: req.files[0].originalname,
  });
  next();
});

router.post("/uploadProduct", auth, (req, res) => {
  const product = new Product(req.body);

  product.save((err) => {
    if (err) return console.log(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/getProducts", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchTerm;

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });

        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });

        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  }
});

router.get("/products_by_id", (req, res) => {
  let type = req.query.type;
  let productId = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    productId = [];
    productId = ids.map((item) => {
      return item;
    });
  }
  Product.find({ _id: { $in: productId } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

router.post("/increaseviews", (req, res) => {
  let productId = req.query._id;

  Product.findOneAndUpdate({ _id: { $in: productId } }, { $inc: { views: 1 } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
