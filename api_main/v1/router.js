const router = require("express").Router();
const { cekStatus, cekSession } = require("../../middlewares/deviceMiddleware");
const { loginRequired } = require("../../middlewares/userMiddlewares");
const controllers = require("./controller");
router.post("/startsesh", cekStatus, loginRequired, controllers.startsesh);
router.post("/stopsesh", loginRequired, controllers.stopsesh);
router.post("/stream", cekSession, controllers.streamdata);
module.exports = router;
