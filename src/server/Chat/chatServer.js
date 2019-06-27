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

    const ips = [];
    wsServer.on("request", request => {
        // This allows users on the same IP to connect. Will work just fine, but maybe the `ips` array
        // should be abstracted into the room manager.
        let suffix = 1;
        let clientIp = request.remoteAddress;
        while (ips.some(ip => ip === clientIp)) {
            clientIp = `${request.remoteAddress}${suffix}`;
            suffix++;
        }
        ips.push(clientIp);
        console.log(`Connection from ${clientIp}.`);

        const connection = request.accept(null, request.origin); // replace request.origin with * if this doesn't work
        room.addClient(connection, clientIp);

        connection.on("message", message => {
            if (message.type === "utf8") {
                try {
                    const json = JSON.parse(message.utf8Data);
                    if (json.type === "name") {
                        room.updateClientName(clientIp, json.value);
                        room.propagateNewClient(clientIp);
                    }
                    else if (json.type === "message") {
                        room.postMessage(json.value, clientIp);
                    }
                }
                catch (e) {
                    console.error(`Message data is not in a format we use: ${message.utf8Data}`);
                }
            }
        });

        connection.on("close", () => {
            room.removeclient(clientIp);
        });
    });
    started = true;
}

exports.startChatServer = startServer;