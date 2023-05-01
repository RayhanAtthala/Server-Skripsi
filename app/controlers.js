const { setCookie } = require("../services/auth");
// Put your controller code here
exports.login = (req, res) => {
  const data = {
    styles: ["/style/login.css"],
    js: ["/js/login.js"],
  };
  res.render("login", data);
};
exports.register = (req, res) => {
  const data = {
    styles: ["/style/login.css"],
    js: ["/js/register.js"],
  };
  res.render("register", data);
};
exports.main = (req, res) => {
  const data = {
    styles: ["/style/main.css"],
    js: ["/js/main.js"],
  };
  res.render("main", data);
};
exports.device = (req, res) => {
  const data = {
    styles: ["/style/device.css"],
    js: ["/js/device.js"],
  };
  res.render("device", data);
};
exports.session = (req, res) => {
  const data = {
    styles: ["/style/session.css"],
  };
  res.render("session", data);
};
exports.summary = (req, res) => {
  const data = {
    styles: ["/style/summary.css"],
  };
  res.render("summary", data);
};

exports.logout = (req, res) => {
  setCookie({ res, title: "Authorization", data: "", maxAge: 1 });
  res.redirect("/login");
};
