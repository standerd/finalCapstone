const express = require("express");
const mongoose = require("mongoose");
const KEYS = require("./config/keys");
const bodyParser = require("body-parser");
const multer = require("multer");
const PORT = process.env.PORT || 3001;
const userSearchRoute = require("./routes/userRoutes/userSearch");
const entityRegRoute = require("./routes/entityRoutes/entityReg");
const entityMaint = require("./routes/entityRoutes/entityMaint");
const userAccount = require("./routes/userRoutes/userAccount");
const path = require("path");

//intialise express app.
const app = express();

//setup body parser
app.use(bodyParser.json());

// Setup Multer and file access and storage handler for images upload and access

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

// set headers to ensure CORRS requests can pass.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes setup
app.use("/entity", entityRegRoute);
app.use("/entityMaint", entityMaint);
app.use("/search", userSearchRoute);
app.use("/user", userAccount);

// mongo db connection setup
mongoose.connect(
  KEYS.keys.mongoUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("MongoDB Connected")
);

//app set to listen of port 3001 if ENV is not used
app.listen(PORT, () => console.log(`Server is Listening on Port ${PORT}`));
