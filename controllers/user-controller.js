const { Thought, User } = require("../models");

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: "thoughts",
        select: ["-__v", "-username"],
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        // If no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id!",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "No user found with this id!",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

   // delete user
   deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
       .then((dbUserData) => {
          if (!dbUserData) {
             res.status(404).json({
                message: "No user found with this id!",
             });
             return;
          }
          // delete all thoughts with that username
          return Thought.deleteMany({ username: dbUserData.username });
       })
       .then((dbDeleteData) => res.json(dbDeleteData))
       .catch((err) => res.status(400).json(err));
 },


   // add friend to user
   addFriend({ params }, res) {
    // check if friend ID exists
    User.findOne({ _id: params.friendId })
       .then((dbFriendData) => {
          if (!dbFriendData) {
             res.status(404).json({
                message: "No friend found with this id!",
             });
             return;
          }
          // then update user with new friend
          User.findOneAndUpdate(
             { _id: params.userId },
             { $push: { friends: params.friendId } },
             { new: true }
          ).then((dbUserData) => {
             // then check if user ID existed
             if (!dbUserData) {
                res.status(404).json({
                   message: "No user found with this id!",
                });
                return;
             }
             res.json(dbUserData);
          });
       })
       .catch((err) => res.status(400).json(err));
 },

 // delete friend from user
 deleteFriend({ params }, res) {
    // check if friend ID exists
    User.findOne({ _id: params.friendId })
       .then((dbFriendData) => {
          if (!dbFriendData) {
             res.status(404).json({
                message: "No friend found with this id!",
             });
             return;
          }
          // then update user with removed friend
          User.findOneAndUpdate(
             { _id: params.userId },
             { $pull: { friends: params.friendId } },
             { new: true }
          ).then((dbUserData) => {
             // then check if user ID existed
             if (!dbUserData) {
                res.status(404).json({
                   message: "No user found with this id!",
                });
                return;
             }
             res.json(dbUserData);
          });
       })
       .catch((err) => res.status(400).json(err));
 },
 
};

module.exports = userController;
