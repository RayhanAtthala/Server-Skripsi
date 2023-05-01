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
const haveDevice = async (req, res, next) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        userId: await getUser(req),
      },
    });
    if (device) throw "Device Sudah Ditautkan Dengan User Lain";
    return next();
  } catch (error) {
    return resError({ res, title: error });
  }
};

const haveDeviceUi = async (req, res, next) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        userId: await getUser(req),
      },
    });
    if (device) throw "Device Sudah Ditautkan Dengan User Lain";
    return next();
  } catch (error) {
    return res.redirect("/");
  }
};
const cekStatus = async (req, res, next) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        userId: await getUser(req),
      },
    });
    console.log(device);
    if (!device) throw "Requirement user sudah tidak terpenuhi";
    return next();
  } catch (error) {
    return resError({ res, title: error });
  }
};
const cekSession = async (req, res, next) => {
  try {
    const device = await prisma.session.findMany({
      orderBy: {
        id: "desc",
      },
      take: 1,
      where: {
        active: true,
      },
    });
    console.log(device);
    if (device.length == 0) throw "Session tidak ditemukan !";
    return next();
  } catch (error) {
    return resError({ res, title: error });
  }
};

module.exports = { cekDevice, haveDevice, haveDeviceUi, cekStatus, cekSession };
