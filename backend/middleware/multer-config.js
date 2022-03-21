// On require multer
const multer = require("multer");

// On défini le type de fichier que l'on souhaite avec leurs extensions
const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Permet d'enregister notre fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // destination (dossier images)
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // On remplace dans le fichier d'origine les espace par _
    const extension = MIME_TYPE[file.mimetype]; // On applique l'extention via le minetype
    callback(null, name + Date.now() + "." + extension); // On recupere le nom + la date + l'extention qui nous donnera notre fichier
  },
});

// On export
module.exports = multer({ storage }).single("image");
