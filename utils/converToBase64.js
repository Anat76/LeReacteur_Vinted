// Fonction qui permet de transformer nos fichier qu'on reçois sous forme de Buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64;
