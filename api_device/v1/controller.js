const { resError, resSuccess } = require("../../services/responseHandler");
const { makeid } = require("../../services/generate");
const { getUser } = require("../../services/auth");
const prisma = require("../../prisma/client");

exports.generateid = async (req, res) => {
  try {
    const id = makeid(5);
    const data = await prisma.device.create({
      data: {
        shortid: id,
      },
    });
    return resSuccess({ res, title: "Sukses membuat id", data: { data } });
  } catch (error) {
    console.log(error);
    return resError({ res, title: "Gagal membuat id", errors: error });
  }
};

exports.linkDevice = async (req, res) => {
  try {
    const idDevice = req.body.id;
    console.log(idDevice);
    const data = await prisma.device.update({
      where: {
        shortid: idDevice,
      },
      data: {
        user: {
          connect: {
            id: await getUser(req),
          },
        },
      },
    });
    return resSuccess({ res, title: "yey", data: { data } });
  } catch (error) {
    console.log(error);
    return resError({ res, title: "Gagal menautkan perangkat", errors: error });
  }
};
