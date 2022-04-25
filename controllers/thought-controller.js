const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  addThought({ body }, res) {
    Thought.create(body)
      .then((data) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: data._id } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        User.findOneAndUpdate(
          { username: data.username },
          { $pull: { thoughts: params.id } }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(data);
      })
      .catch((err) => res.json(err));
  },

  removeReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((data) => res.json(DataTransfer))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;