const { Api, httpMethods } = require("../routeConfig");
const { room } = require("../Services/Room");

class WodApi extends Api {
    constructor() {
        super();

        this.createRoute(httpMethods.POST, "/api/Join", (req, res) => {
            const { screenName } = req.body;
            const client = room.accept(req.ip, screenName);
            if (!client) {
                res.jsonFail("Could not join room for some reason. Probably you're already joined.");
            }
            else {
                res.jsonSuccess({
                    token: client.token
                });
            }
        });

        this.createRoute(httpMethods.POST, "/api/PostMessage", (req, res) => {
            const { token, messageText } = req.body;

            if (!room.validateToken(req.ip, token)) {
                res.jsonFail("Invalid token for request IP!");
                return;
            }

            const message = room.postMessage(messageText, req.ip);
            if (!message) {
                res.jsonFail("Could not post message!");
            }
            else {
                res.jsonSuccess(message.timestamp);
            }
        });

        this.createRoute(httpMethods.POST, "/api/GetMessages", (req, res) => {
            const { token, lastTimestamp } = req.body;

            if (!room.validateToken(req.ip, token)) {
                res.jsonFail("Invalid token for request IP!");
                return;
            }

            const messages = room.getMessages(lastTimestamp);
            if (!messages) {
                res.jsonFail("Could not get messages!");
            }
            else {
                let jsonMessages = []
                for (let message of messages) {
                    jsonMessages.push({
                        messageText: message.messageText,
                        screenName: message.client.screenName,
                        timestamp: message.timestamp
                    });
                }
                res.jsonSuccess({
                    messages: jsonMessages,
                    timestamp: Date.now()
                });
            }
        });
    }
}

exports.wodController = new WodApi();