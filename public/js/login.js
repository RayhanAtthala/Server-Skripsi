const user = document.getElementById("unameform");
const pass = document.getElementById("passform");
const button = document.getElementById("buttonlog");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const userValue = user.value;
  const passValue = pass.value;

  const resp = await httpRequest({
    url: "/api/v1/user/login",
    body: {
      username: userValue,
      password: passValue,
    },
  });

  if (resp.success === false) {
    alert("Failed to login");
  }

  if (resp.success === true) {
    window.location = "/";
  }
});
