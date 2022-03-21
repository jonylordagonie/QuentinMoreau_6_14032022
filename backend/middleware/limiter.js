// On require express-rate-limit
const rateLimit = require("express-rate-limit");

// On créer une limite de 5 requète toutes les 15 minutes pour le loggin
exports.passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
});

// On créer une limite de 20 requète toutes les 15 minutes pour les actions des sauces
exports.sauceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
});

// On créer une limite de 50 requète toutes les 15 minutes pour les likes
exports.likeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
});
