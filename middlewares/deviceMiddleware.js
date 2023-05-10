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
        if (!device) throw "Requirement user sudah tidak terpenuhi";
        return next();
    } catch (error) {
        return resError({ res, title: error });
    }
};

const cekSession = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        const device = await prisma.session.findFirst({
            where: {
                device: {
                    shortid: deviceId,
                },
                active: true,
            },
            orderBy: {
                createdAt: "asc",
            },
            take: 1,
            select: {
                id: true,
                active: true,
                device: {
                    select: {
                        shortid: true,
                    },
                },
            },
        });
        if (!device) throw "Session tidak ditemukan !";
        return next();
    } catch (error) {
        return resError({ res, title: error });
    }
};

module.exports = { cekDevice, haveDevice, haveDeviceUi, cekStatus, cekSession };
