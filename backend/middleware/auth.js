/*
 * On require dotenv
 * Cela permet de créer un .env stoquant les donnés sensibles
 * Le est mis dans le .gitignore pour ne pas être publique
 */
require("dotenv").config();

// On require jsonwebtoken et créer une constante avec notre clé token
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN;

// Permet de vérifier si l'utilisateur existe avec les tokens demander
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // On recupere le token utiliser
    const decodedToken = jwt.verify(token, tokenkey); // On le compare avec la clé token voir si ça correspond a un utilisateur
    const userId = decodedToken.userId; // On récupere l'id de l'utilisateur via le token
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) { // Si l'userid n'est pas le même que celui du token utiliser
      throw "User Id non valable !";                     // Alors l'id est non valable
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "requête non authentifiée !" });
  }
};
