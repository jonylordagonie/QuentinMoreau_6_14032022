// On require mongoose et unique validator
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// On créé le shéma de notre utilisateur en demandant un email unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// permet de vérifier si l'email est unique
userSchema.plugin(uniqueValidator);

// On export le modèle
module.exports = mongoose.model("User", userSchema);
