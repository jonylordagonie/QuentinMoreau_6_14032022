const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const tokenkey = process.env.TOKEN;

const User = require("../models/User");

const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().regex(/^[\w.-]+[@]{1}[a-zA-Z0-9-.]+[.]{1}[a-z]{1,6}$/),
  password: Joi.string().pattern(new RegExp(/^[\w.]{8,30}$/)),
});

exports.signup = (req, res, next) => {
  schema.validateAsync({
    email: req.body.email,
    password: req.body.password,
  })
  .then((data) => {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  })
  .catch((error) => res.status(400).json({ error }));
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, tokenkey, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
