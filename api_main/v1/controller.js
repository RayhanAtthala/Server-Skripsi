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

        const data = await prisma.history.create({
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

        req.app.io.emit(`onbroadcast/${session.device.shortid}`, {
            cahaya,
            jarak,
            flex,
            rest,
        });
        return resSuccess({ res, title: "Stream Data", data: data });
    } catch (error) {
        console.log(error);
        return resError({ res, title: "Stream Data failed", errors: error });
    }
};
