/*
  * On require dotenv
  * Cela permet de créer un .env stoquant les donnés sensibles
  * Le est mis dans le .gitignore pour ne pas être publique
*/
require("dotenv").config();

// On require express et on l'applique
const express = require("express");
const app = express();

// On require mongose et on crer une constante du chemin de la DB
const mongoose = require("mongoose");
const dataBase = process.env.DATA_BASE;

// On require nos différent module
const path = require("path");// Dl de fichier et stocage dans nos fichiers
const helmet = require("helmet");// Protection contre les attaques du middle
const mongoSanitize = require("express-mongo-sanitize");// Protection contre les attaques par injection

// On créé nos routes principales
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// On connect notre DB
mongoose
  .connect(dataBase, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Fonction principal d'express
app.use(express.json());

// Autorisation du cross origin (pour partage de donné avec notre API server)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Chemin pour enregistrer les images Dl pour l'utilisateur
app.use("/images", express.static(path.join(__dirname, "images")));

// Enpechement du cross origin pour evité les attaque du middle
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.disable("x-powered-by");

// On autorise l'utilisation des $ dans les champs mais les remplaçons pas _ (protection injection)
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);

// On appel nos routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// On exporte notre module app.
module.exports = app;
