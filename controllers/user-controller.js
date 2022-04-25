const { User } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find()
      .select("-__v")
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getUserById(req, res) {
    console.log(req.params.id)
    User.findOne({_id: req.params.id})
      .select("-__v")
      .then((data) => {
        res.json(data);
        console.log(data)
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  registerUser({ body }, res) {
    User.create(body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  updateUser({ params, body }, res) {
    User.updateOne({ _id: params.id }, body, { new: true, runValidators: true })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  deleteUser({ params }, res) {
    User.deleteOne({ _id: params.id })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  addFriend({ params }, res) {
    User.findByIdAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  deleteFriend({ params }, res) {
    User.findByIdAndDelete(
      { _id: params.id },
      { $pull: { friends: params.friendId } }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
};

module.exports = userController;