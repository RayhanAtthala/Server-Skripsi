const device = document.getElementById("deviceValue");
const button = document.getElementById("buttonAdd");

button.addEventListener("click", async (e) => {
  e.preventDefault;
  const deviceValue = device.value;

  const resp = await httpRequest({
    url: "/api/v1/device/link-id",
    body: {
      id: deviceValue,
    },
  });
  if (resp.success === false) {
    alert(resp.error);
  }

  if (resp.success === true) {
    window.location = "/";
  }
});
