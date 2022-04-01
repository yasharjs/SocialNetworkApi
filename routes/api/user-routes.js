const router = require("express").Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    addFriend,
    deleteFriend,
    updateUser,
    deleteUser,
  } = require("../../controllers/user-controller");
  
  // /api/users
  router.route("/").get(getAllUsers).post(createUser);
  
  // /api/users/:id
  router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);
  
  // /api/users/:userId/friends/:friendId
  router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);
  
module.exports = router;
