const { Api, httpMethods } = require("../routeConfig");
const { roomManager } = require("../Services/Room");

class WodApi extends Api {
    constructor() {
        super();

        this.createRoute(httpMethods.POST, "/api/CreateRoom", (req, res) => {
            const { roomName, password, screenName } = req.body;
            if (!roomName) {
                res.jsonFail("Room must have a name!");
                return;
            }

            if (!password) {
                res.jsonFail("Room must have a password!");
                return;
            }

            if (this._rooms.some(room => room.name === roomName)) {
                res.jsonFail("Room with that name already exists!");
                return;
            }

            const client = roomManager.createRoom(roomName, password, req.ip, screenName);
            res.jsonSuccess({ token: client.token });
        });

        this.createRoute(httpMethods.POST, "/api/JoinRoom", (req, res) => {
            const { roomName, password, screenName } = req.body;
            if (!roomName) {
                res.jsonFail("Room must have a name!");
                return;
            }

            if (!password) {
                res.jsonFail("Room must have a password!");
                return;
            }
            
            const client = roomManager.joinRoom(roomName, password, req.ip, screenName);
            if (!client) {
                res.jsonFail(`Incorrect password provided for room "${roomName}"!`);
            }
            else {
                res.jsonSuccess({ token: client.token });
            }
        });

        this.createRoute(httpMethods.POST, "/api/PostMessage", (req, res) => {
            const { roomName, token, messageText } = req.body;

            if (!roomManager.validateToken(roomName, token, req.ip)) {
                res.jsonFail("Could not validate token!");
                return;
            }

            const message = roomManager.postMessage(roomName, req.ip, messageText);
            if (!message) {
                res.jsonFail("Could not post message!");
            }
            else {
                res.jsonSuccess(message.timestamp);
            }
        });

        this.createRoute(httpMethods.POST, "/api/GetMessages", (req, res) => {
            const { roomName, token, lastTimestamp } = req.body;

            if (!roomManager.validateToken(roomName, token, req.ip)) {
                res.jsonFail("Could not get messages!");
                return;
            }

            const messages = roomManager.getMessages(roomName, lastTimestamp);
            if (!messages) {
                res.jsonFail("Could not get messages!");
            }
            else {
                res.jsonSuccess({
                    messages,
                    timestamp: Date.now()
                });
            }
        });
    }
}

exports.wodController = new WodApi();