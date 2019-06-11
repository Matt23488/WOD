class RoomManager {
    constructor() {
        this._rooms = [];
    }

    *getRooms() {
        for (let room of this._rooms) yield room;
    }

    getRoom(roomName) {
        return this._rooms.filter(room => room.name === roomName)[0];
    }

    createRoom(roomName, password, clientIp, screenName) {
        const newRoom = new Room(roomName, password);
        this._rooms.push(newRoom);
        return newRoom.accept(clientIp, password, screenName);
    }

    joinRoom(roomName, password, clientIp, screenName) {
        const room = this.getRoom(roomName);
        if (!room) {
            return this.createRoom(roomName, password, clientIp, screenName);
        }

        return room.accept(clientIp, password, screenName);
    }

    validateToken(roomName, token, clientIp) {
        const room = this.getRoom(roomName);
        if (!room) return false;

        const client = room.getClient(clientIp);
        if (!client || client.token !== token) return false;

        return true;
    }

    postMessage(roomName, clientIp, messageText) {
        const room = this.getRoom(roomName);
        if (!room) return;

        return room.postMessage(messageText, clientIp);
    }

    getMessages(roomName, lastTimestamp) {
        const room = this.getRoom(roomName);
        if (!room) return;

        return [...room.getMessages(lastTimestamp)];
    }
}

class Room {
    constructor(name, password) {
        this._name = name;
        this._password = password;
        this._clients = [];
        this._currentToken = 0; // TODO: Replace this with something more robust in the end lol
        this._messages = [];
    }

    get name() { return this._name; }
    get password() { return this._password; }
    
    *getClients() {
        for (let client of this._clients) yield client;
    }

    *getMessages(timestamp = 0) {
        for (let message of this._messages) {
            if (message.timestamp > timestamp) yield message;
        }
    }

    getClient(ipAddress) {
        for (let client of this._clients) {
            if (client.ipAddress === ipAddress) {
                return client;
            }
        }
    }

    accept(ipAddress, password, screenName) {
        if (password !== this._password) return;
        
        const client = new Client(ipAddress, this._currentToken, screenName);
        this._clients.push(client);
        this._currentToken++;
        return client;
    }

    postMessage(text, clientIp) {
        const client = this.getClient(clientIp);
        if (!client) return;

        const message = new Message(text, client);
        this._messages.push(message);
        return message;
    }
}

class Client {
    // TODO: Currently allowing multiple clients to have the same screen name.
    constructor(ipAddress, token, screenName) {
        this._ipAddress = ipAddress;
        this._token = token;
        this._screenName = screenName;
    }

    get ipAddress() { return this._ipAddress; }
    get token() { return this._token; }
    get screenName() { return this._screenName; }
}

class Message {
    constructor(messageText, client) {
        this._messageText = messageText;
        this._timestamp = Date.now();
        this._client = client;
    }

    get messageText() { return this._messageText; }
    get timestamp() { return this._timestamp; }
    get client() { return this._client; }
}

// const roomManager = new RoomManager();

// exports.Room = Room;
exports.roomManager = new RoomManager();