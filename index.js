/*=====================================SETUP=======================================*/

// On import tous les packages dont on a besoin
const express = require("express");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/*=====================================BDD=======================================*/

// On connect la BDD Mongoose
mongoose.connect(process.env.MONGODB_URI);

/*=====================================CLOUDINARY=======================================*/

//  je me connect à mon compte coudinary avec les mes identifiants sur mon Tableau de Bord
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/*=====================================ROUTES=======================================*/

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

/*============================================================================*/

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue sur ma Page d'acceuil" });
});

// route 404
app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

// Lancement Server
app.listen(process.env.PORT, () => {
  console.log("Serveur Started");
});
