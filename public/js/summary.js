const usedTime = document.getElementById("used-time");
const restIns = document.getElementById("rest-instance");

function summary(data) {
    console.log(data);
    const time1 = new Date(data.createdAt);
    const time2 = new Date(data.stopTime);

    const time = (time2 - time1) / 1000;

    const finalTime = formatDuration(time);

    usedTime.textContent = finalTime;
    restIns.textContent = data.streamInstance;
}

generalDataLoader({ url: "/api/v1/session/summaryTime", func: summary });

function formatDuration(seconds) {
    const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}
