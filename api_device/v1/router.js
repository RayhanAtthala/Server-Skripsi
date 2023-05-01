const router = require("express").Router();
const { body, query } = require("express-validator");
const { formChacker } = require("../../middlewares/formMiddleware");
const { haveDevice } = require("../../middlewares/deviceMiddleware");
const controllers = require("./controller");
router.post("/generate-id", controllers.generateid);
router.post("/link-id", haveDevice, controllers.linkDevice);
module.exports = router;
