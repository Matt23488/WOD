class Room {
    constructor() {
        this._clients = [];
        this._rooms = [];
        this._messages = [];
        this._utc42069 = Date.UTC(69, 4, 20);
        this._nextClientId = 0;
        this._nextRoomId = 0;

        this._publicRoom = new ChatRoom(this.newRoomId());
        this._rooms.push(this._publicRoom);
    }

    newClientId() {
        return this._nextClientId++;
    }

    newRoomId() {
        return this._nextRoomId++;
    }

    *getMessages(timestamp = 0) {
        for (let message of this._messages) {
            if (message.timestamp > timestamp) yield message;
        }
    }

    getClient(clientId) {
        for (let client of this._clients) {
            if (client.id === clientId) {
                return client;
            }
        }
    }

    getClients(...clientIds) {
        return this._clients.filter(c => clientIds.some(id => id === c.id));
    }

    getRoom(roomId) {
        for (let room of this._rooms) {
            if (room.id === roomId) return room;
        }
    }

    getRoomsForClient(clientId) {
        return this._rooms.filter(r => r.clientIds.some(id => id === clientId));
    }

    registerNewClient(request) {
        const connection = request.accept(null, request.origin); // TODO: replace request.origin with * if this doesn't work
        console.log(`New connection from ${connection.remoteAddress}.`);

        const newClient = new Client(connection, this.newClientId());
        this._clients.push(newClient);

        connection.on("message", message => {
            if (message.type === "utf8") {
                try {
                    const json = JSON.parse(message.utf8Data);
                    if (json.type === "init") {
                        this.initClient(newClient.id, json.value.name, json.value.utc42069);
                        this.propagateNewClient(newClient.id);
                    }
                    else if (json.type === "message") {
                        this.postMessage(json.value, newClient.id, json.roomId);
                    }
                }
                catch (e) {
                    console.error(`Message data is not in a format we use: ${message.utf8Data}`);
                }
            }
        });

        connection.on("close", () => {
            this.removeClient(newClient.id);
            console.log(`Connection from ${connection.remoteAddress} closed.`);
        });
    }

    initClient(clientId, screenName, utc42069) {
        let client = this.getClient(clientId);
        if (!client) return false;

        client.screenName = screenName;
        client.timestampOffset = utc42069 - this._utc42069;
        this._clients.forEach(c => c.sendMessage(new WSMessage(
            "info",
            c.timestampOffset,
            {
                rooms: [ { id: this._publicRoom.id, users: this._publicRoom.clientIds } ],
                messageText: `${screenName} has connected.`
            }
        )));
        return true;
    }

    propagateNewClient(clientId) {
        let client = this.getClient(clientId);
        if (!client) return false;

        this._publicRoom.addClient(clientId);

        const otherClients = this._clients.filter(c => c.id !== clientId);
        client.sendMessage(new WSMessage(
            "init",
            client.timestampOffset,
            {
                id: clientId,
                rooms: [ { id: this._publicRoom.id, users: this._publicRoom.clientIds } ],
                users: this._clients.map(({ id, screenName }) => { return { id, screenName }; })
            }
        ));
        otherClients.forEach(c => c.sendMessage(new WSMessage("newUser", c.timestampOffset, {
            id: client.id,
            screenName: client.screenName,
            rooms: [ { id: this._publicRoom.id, users: this._publicRoom.clientIds } ]
        })));
        return true;
    }

    postMessage(text, clientId, roomId) {
        const client = this.getClient(clientId);
        if (!client || !client.screenName) return false;

        const room = this.getRoom(roomId);
        if (!room) return false;

        if (!room.clientIds.some(id => id === clientId)) return false;

        // TODO: If I end up needing this I'll need to put it in the ChatRoom class.
        const message = new Message(text, client);
        this._messages.push(message);

        this.getClients(...room.clientIds).forEach(c => c.sendMessage(new WSMessage(
            "message",
            c.timestampOffset,
            {
                messageText: message.messageText,
                id: client.id,
                roomId: roomId
            }
        )));

        return true;
    }

    removeClient(clientId) {
        const client = this.getClient(clientId);
        if (!client) return false;

        this._clients = this._clients.filter(c => c.id !== clientId);
        this._clients.forEach(c => {
            c.sendMessage(new WSMessage(
                "info",
                c.timestampOffset,
                {
                    // TODO: Need to abstract this ugly mess. It's currently in four places.
                    rooms: [ { id: this._publicRoom.id, users: this._publicRoom.clientIds } ],
                    messageText: `${client.screenName} has disconnected.`
                }
            ));
            c.sendMessage(new WSMessage(
                "disconnect",
                c.timestampOffset,
                clientId
            ));
        });

        for (let i = 0; i < this._rooms.length; i++) {
            const room = this._rooms[i];
            if(!room.removeClient(clientId)) continue;
            if (i > 0 && room.clientIds.length === 1) {
                // TODO: Need to notify other clients to destroy their rooms client-side.
                this._rooms.splice(i, 1);
                i--;
            }
        }

        return true;
    }
}

class Client {
    constructor(connection, id) {
        this._connection = connection;
        this._id = id;
    }

    get id() { return this._id; }
    get screenName() { return this._screenName; }
    set screenName(value) { this._screenName = value; }
    get timestampOffset() { return this._timestampOffset; }
    set timestampOffset(value) { this._timestampOffset = value; }

    sendMessage(message) {
        this._connection.send(JSON.stringify(message));
    }
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

class WSMessage {
    constructor(type, timestampOffset, messageData) {
        this.type = type;
        this.timestamp = Date.now() + timestampOffset;
        this.message = messageData
    }
}

class ChatRoom {
    constructor(id, ...clientIds) {
        this._id = id;
        this._clientIds = clientIds;
    }

    get id() { return this._id; }
    get clientIds() {
        return this._clientIds.map(obj => obj);
    }

    addClient(clientId) {
        this._clientIds.push(clientId);
    }

    removeClient(clientId) {
        const index = this._clientIds.indexOf(clientId);
        if (index === -1) return false;
        this._clientIds.splice(index, 1);
        return true;
    }
}

exports.room = new Room();