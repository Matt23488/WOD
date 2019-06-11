class RoomManager {
    constructor() {
        this._rooms = [];
    }

    *getRooms() {
        for (let room of this._rooms) yield room;
    }

    createRoom(name, password, clientIp) {
        const newRoom = new Room(name, password);
        this._rooms.push(newRoom);
        return newRoom.accept(clientIp, password);
    }

    joinRoom(name, password, clientIp) {
        const room = this._rooms.filter(room => room.name === name)[0];
        if (!room) {
            return this.createRoom(name, password, clientIp);
        }

        return room.accept(clientIp, password);
    }
}

class Room {
    constructor(name, password) {
        this._name = name;
        this._password = password;
        this._clients = [];
        this._currentToken = 0; // TODO: Replace this with something more robust in the end lol
    }

    get name() { return this._name; }
    get password() { return this._password; }
    
    *getClients() {
        for (let client of this._clients) yield client;
    }

    getClient(ipAddress) {
        for (let client of this._clients) {
            if (client.ipAddress === ipAddress) {
                return client;
            }
        }
    }

    accept(ipAddress, password) {
        if (password !== this._password) return;
        
        const client = new Client(ipAddress, this._currentToken);
        this._clients.push(client);
        this._currentToken++;
        return client;
    }
}

class Client {
    constructor(ipAddress, token) {
        this._ipAddress = ipAddress;
        this._token = token;
    }

    get ipAddress() { return this._ipAddress; }
    get token() { return this._token; }
}

// const roomManager = new RoomManager();

// exports.Room = Room;
exports.roomManager = new RoomManager();