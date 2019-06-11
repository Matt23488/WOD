const { Api, httpMethods } = require("./routeConfig");
const { Room } = require("./Room");

function standardResponse() {
    return function (req, res, next) {
        res.jsonSuccess = data => {
            res.json({
                success: true,
                message: "",
                data
            });
        };

        res.jsonFail = message => {
            res.json({
                success: false,
                message,
                data: null
            });
        };

        next();
    }
}

class WodApi extends Api {
    constructor() {
        super();
        this._rooms = [];
        
        this.createRoute(httpMethods.POST, "/api/CreateRoom", this.createRoom.bind(this));
        this.createRoute(httpMethods.POST, "/api/JoinRoom", this.joinRoom.bind(this));
    }

    createRoom(req, res) {
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

        const newRoom = new Room(name, password);
        this._rooms.push(newRoom);
        const client = newRoom.accept(req.ip, password);
        res.jsonSuccess({ token: client.token });
    }

    joinRoom(req, res) {
        const { name, password } = req.body;
        const room = this._rooms.filter(room => room.name === name)[0];
        if (!room) {
            res.jsonFail(`No room with name "${name}" found!`);
            return;
        }

        const client = room.accept(req.ip, password);
        if (!client) {
            res.jsonFail(`Incorrect password provided for room "${name}"!`);
            return;
        }

        res.jsonSuccess({ token: client.token });
    }
}

function getController() {
    return new WodApi();
}

exports.standardResponse = standardResponse;
exports.getController = getController;