const User = require("../models/User");

const isAuthenticaced = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // je recupere le token dans une variable et j'enleve "Bearer"
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

    // je vais chercher mon User dans ma BD
    const user = await User.findOne({ token: token }).select("account");
    // console.log(user);
    // si il existe pas
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // je rejoute l'user trouvé quand "req"
    req.user = user;
    console.log(req.user);
    // je passe au suivant
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = isAuthenticaced;
