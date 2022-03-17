const Sauce = require("../models/Sauce");
const fs = require("fs");

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

exports.sauceDisplayAll = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.sauceDisplayOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.sauceDelete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      if (sauce.userId !== req.auth.userId) {
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

exports.sauceModif = (req, res, next) => {
  const sauceObject = req.file
    ? {      
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`,
      }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ error: new Error("Unauthorized request!") });
      } else {
        fs.unlink(`images/${filename}`, () => {
          if (!sauce) {
            res.status(404).json({ roor: new Error("No such Sauce!") });
          } else {
            Sauce.updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Objet modifié !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
      }
  })
};
