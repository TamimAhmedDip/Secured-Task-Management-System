const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

const { signup, getUser, login } = require("../controllers/userControllers");

router.route("/signup").post(signup);
router.route("/").get(requireAuth, getUser);
router.route("/login").post(login);

module.exports = router;
