const startStopButton = document.getElementById("pause");
const sessionButton = document.getElementById("pause");
const timeCounter = document.getElementById("time");
const deviceIdContainer = document.getElementById("device-id");
const deviceId = deviceIdContainer.getAttribute("data-id");
const cahayaContainer = document.getElementById("cahaya");
const jarakContainer = document.getElementById("jarak");
const posisiContainer = document.getElementById("posisi");
const istirahatContainer = document.getElementById("istirahat");
let state = "not started";
let interval;

function myTimer(startDate) {
    const d = new Date(new Date() - startDate);
    const minutes =
        String(d.getMinutes()).length == 1
            ? `0${d.getMinutes()}`
            : d.getMinutes();
    const second =
        String(d.getSeconds()).length == 1
            ? `0${d.getSeconds()}`
            : d.getSeconds();
    timeCounter.textContent = `${minutes}:${second}`;
}

// Cek Apakah Ada Sessi Yang Aktif
const sessionHandler = async () => {
    const resp = await httpRequest({
        url: "/api/v1/session/active",
        method: "GET",
    });
    console.log(resp);
    if (resp.success) {
        state = "started";
        sessionButton.setAttribute("src", "/imagesrc/PauseButton.svg");
        const startDate = new Date(resp.data.createdAt);
        interval = setInterval(() => myTimer(startDate), 1000);
    }
};

sessionHandler();

startStopButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (state == "not started") {
        const resp = await httpRequest({
            url: "/api/v1/session/startsesh",
            body: {},
        });
        state = "started";

        if (resp.success === false) {
            if (resp.errors) {
                alert(resp.errors);
            } else {
                alert("Start Session Failed !");
            }
        }
        if (resp.success === true) {
            // alert("Session Started");
            sessionButton.setAttribute("src", "/imagesrc/PauseButton.svg");
            const startDate = new Date();
            interval = setInterval(() => myTimer(startDate), 1000);
        }
    } else {
        const resp = await httpRequest({
            url: "/api/v1/session/stopsesh",
            body: {},
        });
        state = "not started";
        if (resp.success === false) {
            if (resp.errors) {
                alert(resp.errors);
            } else {
                alert("Stop Session Failed !");
            }
        }
        if (resp.success === true) {
            window.location = "/summary";
        }
    }
});

const socket = io();
socket.on("connect", (s) => {});

socket.on(`onbroadcast/${deviceId}`, (data) => {
    cahayaContainer.textContent = data.cahaya;
    jarakContainer.textContent = data.jarak;
    posisiContainer.textContent = data.flex;
    istirahatContainer.textContent = data.rest;
});
