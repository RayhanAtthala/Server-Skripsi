const { resError } = require("../services/responseHandler");
const prisma = require("../prisma/client");
const { getUser } = require("../services/auth");
const cekDevice = async (req, res, next) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        userId: await getUser(req),
      },
    });
    console.log(device);
    if (device === null) throw "error";
    return next();
  } catch (error) {
    return res.redirect("/device");
  }
};

module.exports = { cekDevice };
