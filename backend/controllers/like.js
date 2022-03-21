const Sauce = require("../models/Sauce");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN;

exports.sauceLike = (req, res, next) => {
  const like = req.body.like;
  if (like == 1) { // Si on click sur like
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenkey);
      const userId = decodedToken.userId;
      const likesArray = sauce.usersLiked;
      if (
        !likesArray.includes(userId) &&
        !likesArray.includes(userId)
      ) {
        likesArray.push(userId); // On ajoute l'id de lutilisateur a la liste des user qui ont liker
        sauce.likes++; // On ajoute un like

        return sauce // On sauvegarde les informations
          .save()
          .then(() => res.status(201).json({ message: "Liked !" }))
          .catch((error) => res.status(500).json({ error }));
      }
    });
  }
  if (like == -1) { // Si on click sur dislike
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenkey);
      const userId = decodedToken.userId;
      const likesArray = sauce.usersDisliked;
      if (
        !likesArray.includes(userId) &&
        !likesArray.includes(userId)
      ) {
        likesArray.push(userId); // On ajoute l'id de lutilisateur a la liste des user qui ont disliker
        sauce.dislikes++; // On ajoute un dislike

        return sauce // On sauvegarde les informations
          .save()
          .then(() => res.status(201).json({ message: "Disliked !" }))
          .catch((error) => res.status(500).json({ error }));
      }
    });
  }
  if (like == 0) { // Si l'utilisateur reclique sur like ou dislike alors qu'il l'on déjà fait
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, tokenkey);
      const userId = decodedToken.userId;
      const likesArray = sauce.usersLiked;
      const dislikesArray = sauce.usersDisliked;
      if (likesArray.includes(userId)) { // Pour les likes
        likesArray.splice(likesArray.indexOf(userId), 1); // On supprime l'id de l'utilisateur de la liste des user qui ont liker
        sauce.likes--; // On enlève un like
        sauce.usersLiked = likesArray;

        return sauce // On sauvegarde les informations
          .save()
          .then(() => res.status(201).json({ message: "Like delete !" }))
          .catch((error) => res.status(900).json({ error }));
      }
      if (dislikesArray.includes(userId)) {
        // Pour les dislikes
        dislikesArray.splice(dislikesArray.indexOf(userId), 1); // On supprime l'id de l'utilisateur de la liste des user qui ont disliker
        sauce.dislikes--; // On enlève un dislike
        sauce.usersDisliked = dislikesArray;

        return sauce // On sauvegarde les informations
          .save()
          .then(() => res.status(201).json({ message: "Disliked delete !" }))
          .catch((error) => res.status(500).json({ error }));
      }
    });
  }
};
