const Sauce = require("../models/Sauce");
const jwt = require("jsonwebtoken");

exports.sauceLike = (req, res, next) => {
  const like = req.body.like;
  if (like == 1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const likesArray = sauce.usersLiked
        if (
          !likesArray.includes(req.auth.userId) &&
          !likesArray.includes(req.auth.userId)
        ) {
          likesArray.push(req.auth.userId);
          console.log(req.auth.userId);
          sauce.likes++;
          console.log(sauce.usersLiked)
          return sauce
            .save()
            .then(() => res.status(201).json({ message: "Liked !" }))
            .catch((error) => res.status(500).json({ error }));
        }
    })
  }
  if (like == -1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
      if (
        !sauce.usersLiked.includes(req.auth.userId) &&
        !sauce.usersDisliked.includes(req.auth.userId)
      ) {
        sauce.usersDisliked.push(req.auth.userId);
        sauce.dislikes++;

        return sauce
          .save()
          .then(() => res.status(201).json({ message: "Disliked !" }))
          .catch((error) => res.status(500).json({ error }));
        }
      });
  }
  if (like == 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const likesArray = sauce.usersLiked;
        const dislikesArray = sauce.usersDisliked;
      if (likesArray.includes(req.auth.userId)) {
        likesArray.splice(likesArray.indexOf(req.auth.userId), 1);
        sauce.likes--;
        sauce.usersLiked = likesArray;

        return sauce
          .save()
          .then(() => res.status(201).json({ message: "Like delete !" }))
          .catch((error) => res.status(900).json({ error }));
      }
      if (dislikesArray.includes(req.auth.userId)) {
        dislikesArray.splice(dislikesArray.indexOf(req.auth.userId), 1);
        sauce.dislikes--;
        sauce.usersDisliked = dislikesArray;

        return sauce
          .save()
          .then(() => res.status(201).json({ message: "Disliked delete !" }))
          .catch((error) => res.status(500).json({ error }));
      }
    });
  }
};