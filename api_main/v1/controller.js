const { resError, resSuccess } = require("../../services/responseHandler");
const { makeid } = require("../../services/generate");
const { getUser } = require("../../services/auth");
const prisma = require("../../prisma/client");
const client = require("../../connections/mqtt/defineMqtt");
const topic = "body/monitor/";

exports.startsesh = async (req, res) => {
    try {
        const device = await prisma.device.findUnique({
            where: { userId: await getUser(req) },
        });

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
        client.publish(topic + "start/" + device.shortid, "true");
        // console.log(device.shortid);
        return resSuccess({ res, title: "Starting Session", data: { status } });
    } catch (error) {
        console.log(error);
        return resError({ res, title: "Start Session Gagal", errors: error });
    }
};

exports.stopsesh = async (req, res) => {
    try {
        const userId = await getUser(req);
        const device = await prisma.device.findUnique({
            where: {
                userId: userId,
            },
        });

        const session = await prisma.session.findFirst({
            where: {
                device: {
                    shortid: device.shortid,
                },
                active: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const status = await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                active: false,
                stopTime: new Date(),
            },
        });
        client.publish(topic + "stop/" + device.shortid, "false");
        return resSuccess({
            res,
            data: { status },
            title: "Berhasil mengakhiri sesi penggunaan",
        });
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
            title:
                text || "Sukses Menerima data, data tidak disimpan ke database",
        });
    } catch (error) {
        console.log(error);
        return resError({ res, title: "Stream Data failed", errors: error });
    }
};

exports.summaryTime = async (req, res) => {
    try {
        const userId = await getUser(req);

        const lastSession = await prisma.session.findFirst({
            where: {
                device: {
                    userId,
                },
                active: false,
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

exports.activeSession = async (req, res) => {
    try {
        const userId = await getUser(req);
        const session = await prisma.session.findFirst({
            where: {
                device: {
                    userId,
                },
                active: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!session) throw "No active session found";

        return resSuccess({
            res,
            title: "Success get session detail",
            data: session,
        });
    } catch (error) {
        return resError({ res, title: "Failed to get session", errors: error });
    }
};

exports.instanceUpdate = async (req, res) => {
    try {
        const resCount = req.body.count;
        const userId = await getUser(req);
        const session = await prisma.session.findFirst({
            where: {
                device: {
                    userId,
                },
                active: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!session) throw "No active session found";
        const instance = await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                streamInstance: resCount,
            },
        });
        return resSuccess({ res, title: "Success Updating", data: instance });
    } catch (error) {
        return resError({ res, title: "Failed to get session", errors: error });
    }
};
