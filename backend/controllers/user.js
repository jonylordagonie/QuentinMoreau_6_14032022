// On require dotenv et on créé une constant de notre clé token
require("dotenv").config();
const tokenkey = process.env.TOKEN;

// On require bcrypt et jsonwebtoken ainsi que joi
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi"); // Permet de faire une validation regex

// On require notre shéma user
const User = require("../models/User");

// On créer un shéma de validation regex
const schema = Joi.object({
  email: Joi.string().regex(/^[\w.-]+[@]{1}[a-zA-Z0-9-.]+[.]{1}[a-z]{1,6}$/),
  password: Joi.string().pattern(new RegExp(/^[\w.]{8,30}$/)),
});

// Enregistrement de l'utilisateur
exports.signup = (req, res, next) => {
  schema.validateAsync({ // On vérifi que le shema regex est respecté
      email: req.body.email,
      password: req.body.password,
    })
    .then((data) => {
      bcrypt // On recupere le mot de pass puis on le hash avec bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new User({ // on créer un nouvel utilisateur
            email: req.body.email,
            password: hash,
          });
          user
            .save() // On le savegarde dans notre DB dans un collection users
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// On vérifi le login
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // On cherche l'utilisateur avec l'email demandé
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // On hash le mdp et on compare au hash de la db
        .then((valid) => {
          if (!valid) { // non valide
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({ //valide
            userId: user._id,
            token: jwt.sign({ userId: user._id }, tokenkey, {  // ont donne un token crypté par notre clé token
              expiresIn: "24h",                                // Utilisable 24h
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
