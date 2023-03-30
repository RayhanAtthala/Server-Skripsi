const email = document.getElementById("emailform");
const user = document.getElementById("unameform");
const pass = document.getElementById("passform");
const button = document.getElementById("buttonlog");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const userValue = user.value;
  const passValue = pass.value;
  const emailValue = email.value;

  const resp = await httpRequest({
    url: "/api/v1/user/register",
    body: {
      email: emailValue,
      username: userValue,
      password: passValue,
    },
  });

  if (resp.success === false) {
    if (resp.errors) {
      alert(resp.errors);
    } else {
      alert("Register Gagal !");
    }
  }

  if (resp.success === true) {
    window.location = "/";
  }
});
