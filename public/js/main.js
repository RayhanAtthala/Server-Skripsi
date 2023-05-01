const pause = document.getElementById("pause");
const sessionButton = document.getElementById("pause");
const timeCounter = document.getElementById("time");
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

pause.addEventListener("click", async (e) => {
    e.preventDefault();
    if (state == "not started") {
        const resp = await httpRequest({
            url: "/api/v1/session/startsesh",
            body: {},
        });
        state = "started";
        console.log("resp", resp);
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
