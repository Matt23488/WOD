const { Api, httpMethods } = require("../routeConfig");
const { roomManager } = require("../Services/Room");

class WodApi extends Api {
    constructor() {
        super();

        this.createRoute(httpMethods.POST, "/api/CreateRoom", (req, res) => {
            const { name, password } = req.body;
            if (!name) {
                res.jsonFail("Room must have a name!");
                return;
            }

            if (!password) {
                res.jsonFail("Room must have a password!");
                return;
            }

            if (this._rooms.some(room => room.name === name)) {
                res.jsonFail("Room with that name already exists!");
                return;
            }

            const client = roomManager.createRoom(name, password, req.ip);
            res.jsonSuccess({ token: client.token });
        });

        this.createRoute(httpMethods.POST, "/api/JoinRoom", (req, res) => {
            const { name, password } = req.body;
            if (!name) {
                res.jsonFail("Room must have a name!");
                return;
            }

            if (!password) {
                res.jsonFail("Room must have a password!");
                return;
            }
            
            const client = roomManager.joinRoom(name, password, req.ip);
            if (!client) {
                res.jsonFail(`Incorrect password provided for room "${name}"!`);
            }
            else {
                res.jsonSuccess({ token: client.token });
            }
        });
    }
}

exports.wodController = new WodApi();