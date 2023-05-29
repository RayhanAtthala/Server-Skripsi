const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://127.0.0.1");

module.exports = client;
