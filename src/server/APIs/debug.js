const { Api, httpMethods } = require("../routeConfig");
const { roomManager } = require("../Services/Room");

class DebugApi extends Api {
    constructor() {
        super();

        this.createRoute(httpMethods.GET, "/debug/GetRoomData", (req, res) => {
            const rooms = [];
            for (let room of roomManager.getRooms()) {
                const clients = [];
                for (let client of room.getClients()) {
                    clients.push({
                        ipAddress: client.ipAddress,
                        token: client.token
                    });
                }
                rooms.push({
                    name: room.name,
                    password: room.password,
                    clients
                });
            }
            res.jsonSuccess(rooms);
        });
    }
}

exports.debugController = new DebugApi();