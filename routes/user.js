const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

/*=====================================SIGNUP=======================================*/
router.post("/user/signup", async (req, res) => {
  try {
    //   console.log(req.body);
    const { username, email, password, newsletter } = req.body;

    // on regarde si il y a deja un utilisateur avec ce mail
    const userExist = await User.findOne({ email: email });

    // si il existe
    if (userExist) {
      // je repond comme quoi l'adresse est deja existante
      return res.status(409).json({ message: "This user as Already exist !" });
    }

    // si il n'y a pas d'username de rentrer je retourn et met fin à la fonction
    if (!username) {
      return res.status(402).json({ message: "Please enter username !" });
    }

    // generer un token
    const token = uid2(64);

    // générer un Salt
    const salt = uid2(16);
    // console.log("salt : ", salt);

    // concatener salt + password et encrypter les 2 pour creer un hash
    const hash = SHA256(salt + password).toString(encBase64);
    // console.log("hash : ", hash);

    // creation d'un nouvel User
    const newUser = new User({
      email,
      account: {
        username,
      },
      newsletter,
      token,
      hash,
      salt,
    });

    // variable qui va etre retournée au client ne comportant pas les données confidentiels
    const returnUser = {
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
      },
    };

    // on sauvegarde dans la BDD
    await newUser.save();

    // on repond au client
    res.status(201).json(returnUser);

    // console.log(returnUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*=====================================LOGIN=======================================*/

router.post("/user/login", async (req, res) => {
  //   console.log(req.body);
  try {
    const { email, password } = req.body;

    // on regarde si l'user existe en BDD
    const userExist = await User.findOne({ email: email });
    // console.log(mailExist);

    // si il existe pas
    if (userExist === null) {
      // on repond en mettant fin à la fonction
      return res.status(401).json({ message: "Unathorized" });
    }

    // si il existe
    const newHash = SHA256(userExist.salt + password).toString(encBase64);

    if (newHash !== userExist.hash) {
      return res.status(401).json({ message: "Unathorized" });
    }
    const returnLogin = {
      _id: userExist._id,
      token: userExist.token,
      account: {
        username: userExist.account.username,
      },
    };
    res.status(200).json(returnLogin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
