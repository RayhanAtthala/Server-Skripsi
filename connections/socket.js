module.exports.socketConnections = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("disconnect", () => {
            console.log("A client disconnected");
        });
    });
};
