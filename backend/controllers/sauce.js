// On require nos moduls et une constante token
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN;
const fs = require("fs"); // permet de suprimer une images lors de la suppression/modification de l'objet

// On require notre schéma de sauce
const Sauce = require("../models/Sauce");

// Créer une sauce
exports.sauceCreate = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Afficher toutes les sauces
exports.sauceDisplayAll = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Afficher une seul sauce
exports.sauceDisplayOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};


// Supprimé une sauce
exports.sauceDelete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenkey);
      const userId = decodedToken.userId;
      const filename = sauce.imageUrl.split("/images/")[1];
      if (sauce.userId !== userId) { // On vérifi que le token veux supprimer a pour userId le même que celui qui a créer la sauce
        res.status(401).json({ error: new Error("Unauthorized request!") });
      } else {
        fs.unlink(`images/${filename}`, () => {
          if (!sauce) {
            res.status(404).json({ roor: new Error("No such Sauce!") });
          }        
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {res.status(200).json({message: "Deleted!",});})
            .catch((error) => {res.status(400).json({error: error,});});
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// Modifier la sauce
exports.sauceModif = (req, res, next) => {
  const sauceObject = req.file
    ? { // On regarde si on update les fichier
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`,
      }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenkey);
      const userId = decodedToken.userId;
      const filename = sauce.imageUrl.split("/images/")[1];
      if (sauce.userId !== userId) {
        res.status(401).json({ error: new Error("Unauthorized request!") });
      } else {
        fs.unlink(`images/${filename}`, () => {
          if (!sauce) {
            res.status(404).json({ roor: new Error("No such Sauce!") });
          } else {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                ...sauceObject, // on update tout remet tout ce qui est demander dans la requête
                _id: req.params.id, // Sauf l'id du créateur
                likes: sauce.likes, // Sauf les likes de la sauces
                dislikes: sauce.dislikes, // Sauf les dislikes de la sauces
                usersLiked: sauce.usersLiked, // Sauf la liste des utilisateurs qui ont liker
                usersDisliked: sauce.usersDisliked, // Sauf la liste des utilisateurs qui ont disliker
              }
            )
              .then(() => res.status(200).json({ message: "Objet modifié !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
      }
  })
};
