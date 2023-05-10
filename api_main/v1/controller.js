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
        let historyData, text;
        // Find Last Active Session
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

        // Cari history, berdasarkan session id terakhir dan pastikan session tersebut masih aktif
        const lastData = await prisma.history.findFirst({
            where: {
                session: {
                    id: session.id,
                    active: true,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                session: {
                    include: {
                        device: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        // Jika belum terdapat data history, maka langsung masukan data tersebut ke database
        if (lastData === null) {
            historyData = await prisma.history.create({
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

            text =
                "Berhasil menerima data pertama, sukses menyimpan data ke database";
        }

        // Jika Sudah terdapat data history
        if (lastData !== null) {
            // Pastikan data yang akan disimpan berjarak 1 menit dari data sebelumnya
            const timeDiff = (Date.now() - lastData.createdAt) / 1000 / 60;
            if (timeDiff >= 1) {
                historyData = await prisma.history.create({
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

                text = "Data berhasil disimpan ke database";
            }
        }

        req.app.io.emit(`onbroadcast/${session.device.shortid}`, {
            cahaya,
            jarak,
            flex,
            rest,
        });

        return resSuccess({
            res,
            title: "Sukses Menerima data, data tidak disimpan ke database",
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

        return resSuccess({
            res,
            title: "Using Time Success!",
            data: lastSession,
        });
    } catch (error) {
        console.log(error.message);
    }
};
