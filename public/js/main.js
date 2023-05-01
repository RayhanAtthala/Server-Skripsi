const pause = document.getElementById("pause");
let state = "not started";
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
      alert("Session Started");
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
