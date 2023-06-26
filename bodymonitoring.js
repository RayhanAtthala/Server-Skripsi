if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");

const app = express();
const PORT = process.env.PORT || 8080;
const ROUTER = require("./router");
const SOCKET_SERVICE = require("./connections/socket");
const http = require("http").Server(app);
const io = require("socket.io")(http);
app.io = io;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.engine("hbs", hbs.__express);
app.set("views", "views");
app.set("view engine", "hbs");
app.set("view options", { layout: "layout/base" });
app.use(express.static("public"));
app.use("/", ROUTER);

SOCKET_SERVICE.socketConnections(io);

http.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
