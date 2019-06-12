const { room } = require("../Services/Room");

const WebSocketServer = require("websocket").server;
const http = require("http");

let started = false;
function startServer() {
    if (started) return;
    const server = http.createServer((req, res) => {
        // Don't need anything here for websockets only apparently
    });
    server.listen(3001, () => {});

    const wsServer = new WebSocketServer({
        httpServer: server
    });

    wsServer.on("request", request => {
        if (room.getClient(request.remoteAddress)) {
            request.reject(403, "Already connected.");
            return;
        }

        const connection = request.accept(null, request.origin); // replace request.origin with * if this doesn't work
        room.addClient(connection);

        connection.on("message", message => {
            if (message.type === "utf8") {
                try {
                    const json = JSON.parse(message.utf8Data);
                    if (json.type === "name") {
                        room.updateClientName(connection.remoteAddress, json.value);
                    }
                    else if (json.type === "message") {
                        room.postMessage(json.value, connection.remoteAddress);
                    }
                }
                catch (e) {
                    console.error(`Message data is not in a format we use: ${message.utf8Data}`);
                }
            }
        });

        connection.on("close", () => {
            room.removeclient(connection.remoteAddress);
        });
    });
    started = true;
}

exports.startChatServer = startServer;