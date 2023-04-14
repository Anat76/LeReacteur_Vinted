// on importe tous les packages dont on a besoin
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlwares/isAuthenticated");

// on importe le model
const Offer = require("../models/Offer");

//
const convertToBase64 = require("../utils/converToBase64");

//
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.files);

      const { title, description, price, condition, city, brand, size, color } =
        req.body;
      // console.log(title, color);
      const picture = req.files.picture;
      // variable pour uploader une image sur Cloudinary
      const uploadPicture = await cloudinary.uploader.upload(
        convertToBase64(picture),
        {
          folder: "/vinted/Offers",
        }
      );
      // console.log(uploadPicture);

      // creation d'une nouvelle offre
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ETAT: condition },
          { COLOR: color },
          { EMPLACEMENT: city },
        ],
        product_image: uploadPicture,
        owner: req.user,
      });

      // on sauvegarde dans la BDD
      await newOffer.save();
      // on repond au client
      res.status(201).json(newOffer);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: error });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    // Je destruture ce que je peux recevoir en query
    const { title, priceMin, priceMax, sort, page } = req.query;
    // console.log(req.query);
    const filter = {};
    if (title) {
      filter.product_name = new RegExp(title, "i");
    }
    if (priceMin && priceMax) {
      filter.product_price = { $gte: priceMin, $lte: priceMax };
    } else if (priceMin) {
      filter.product_price = { $gte: priceMin };
    } else if (priceMax) {
      filter.product_price = { $lte: priceMax };
    }
    console.log(filter);

    //je vais chercher en BDD avec les parametres query
    const filterOffer = await Offer.find(filter);
    // console.log(filterOffer);
    res.status(200).json(filterOffer);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
// j'exporte publish.js
module.exports = router;
