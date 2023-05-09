const { resError, resSuccess } = require("../../services/responseHandler");
const { makeid } = require("../../services/generate");
const { getUser } = require("../../services/auth");
const prisma = require("../../prisma/client");

exports.startsesh = async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { userId: await getUser(req) },
    });
    console.log("device", device);
    const status = await prisma.session.create({
      data: {
        active: true,
        device: {
          connect: {
            id: device.id,
          },
        },
      },
    });
    return resSuccess({ res, title: "Starting Session", data: { status } });
  } catch (error) {
    console.log(error);
    return resError({ res, title: "Start Session Gagal", errors: error });
  }
};

exports.stopsesh = async (req, res) => {
  try {
    const session = await prisma.session.findMany({
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    console.log("session", session);
    const status = await prisma.session.update({
      where: {
        id: session[0].id,
      },
      data: {
        active: false,
      },
    });
    return resSuccess({ res, data: { status } });
  } catch (error) {
    console.log(error);
    return resError({ res, title: "Stop Session Gagal", errors: error });
  }
};
exports.streamdata = async (req, res) => {
  try {
    const { cahaya, jarak, flex, rest, deviceId } = req.body;

    const session = await prisma.session.findFirst({
      where: {
        device: {
          shortid: deviceId,
        },
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        id: true,
        device: {
          select: {
            shortid: true,
          },
        },
      },
    });

    const lastData = await prisma.history.findFirst({
      where: {
        session: {
          active: true,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastData === null) {
      const historyData = await prisma.history.create({
        data: {
          ldr: cahaya,
          distance: jarak,
          posture: flex,
          rest: rest,
          session: {
            connect: {
              id: session.id,
            },
          },
        },
      });

      return resSuccess({ res, title: "Stream Data", data: historyData });
    }

    if (lastData !== null) {
      const timeDiff = (Date.now() - lastData.createdAt) / 1000 / 60;
      if (timeDiff >= 1) {
        const historyData = await prisma.history.create({
          data: {
            ldr: cahaya,
            distance: jarak,
            posture: flex,
            rest: rest,
            session: {
              connect: {
                id: session.id,
              },
            },
          },
        });

        return resSuccess({ res, title: "Stream Data", data: historyData });
      }
    }

    req.app.io.emit(`onbroadcast/${session.device.shortid}`, {
      cahaya,
      jarak,
      flex,
      rest,
    });
  } catch (error) {
    console.log(error);
    return resError({ res, title: "Stream Data failed", errors: error });
  }
};

module.exports.summaryTime = async (req, res) => {
  try {
    const userId = await getUser(req);
    const lastSession = await prisma.session.findFirst({
      where: {
        device: {
          userId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return resSuccess({ res, title: "Using Time Success!", data: lastSession });
  } catch (error) {
    console.log(error.message);
  }
};
