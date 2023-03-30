const router = require("express").Router();
const controller = require("./controlers");
const { cekUser } = require("../middlewares/customMiddleware");
const {
  loginRequired,
  logoutRequired,
} = require("../middlewares/UiMiddleware");

router.get("/", loginRequired, controller.main);
router.get("/login", logoutRequired, controller.login);
router.get("/logout", loginRequired, controller.logout);
router.get("/register", logoutRequired, controller.register);
router.get("/device", loginRequired, controller.device);
router.get("/session", loginRequired, controller.session);
router.get("/summary", loginRequired, controller.summary);
module.exports = router;
