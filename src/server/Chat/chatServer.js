const { room } = require("../Services/Room");

const WebSocketServer = require("websocket").server;
const http = require("http");

let started = false;
function startServer() {
    if (started) return;
    const server = http.createServer((req, res) => {
        // Don't need anything here for websockets only apparently
    });
    const port = parseInt(process.env.WEB_SOCKET_PORT);
    server.listen(port, () => {});

    const wsServer = new WebSocketServer({
        httpServer: server
    });

    wsServer.on("request", request => {
        room.registerNewClient(request);
    });
    started = true;
    console.info(`Websocket server listening on port ${port}!`)
}

exports.startChatServer = startServer;